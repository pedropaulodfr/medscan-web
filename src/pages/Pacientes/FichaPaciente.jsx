import { useEffect, useState, useContext, useRef } from "react";
import moment from "moment";
import { QRCode } from 'react-qrcode-logo';
import { useReactToPrint } from 'react-to-print';

// Bootstrap
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

// Utils e helpers
import Loading from "../../components/Loading/Loading";
import { useApi } from "../../api/useApi";
import { showMessage, showQuestion } from "../../helpers/message";
import TabelaListagem from "../../components/TabelaListagem/TabelaListagem";
import AuthContext from "../../contexts/Auth/AuthContext";
import { Button, Form, Image } from "react-bootstrap";
import AddReceituarios from "../Receituario/AddReceituario";
import AddCartaoControle from "../CartaoControle/AddCartaoControle";
import AddTratamento from "../Tratamentos/AddTratamentos";
import Modals from "../../components/Modals/Modals";
import Logotipo from "../../assets/medscan-logo-qrCode.png"


export default function FichaPaciente( { dados = [], handleReturn, isQRCode = false} ) {
    const api = useApi();
    const ref = useRef(null);
    const { userAcesso } = useContext(AuthContext)
    const [dadosUsuario, setDadosUsuario] = useState(dados)
    const [dadosPaciente, setDadosPaciente] = useState([])
    const [loading, setLoading] = useState(false);
    const [addReceituario, setAddReceituario] = useState(false);
    const [addCartaoControle, setAddCartaoControle] = useState(false);
    const [addTratamento, setAddTratamento] = useState(false);
    const [editarRegistro, setEditarRegistro] = useState(false);
    const [dadosRegistroEditar, setDadosRegistroEditar] = useState([]);
    const [atualizarTabela , setAtualizarTabela]  = useState(false);
    const [cliqueQrCode, setCliqueQrCode] = useState(false);

    //Estilo da pagina de impressão
  const pageStyle = `
      @page { 
        size: auto;  margin: 0mm ;
      } 
      @media print { 
          body { -webkit-print-color-adjust: exact; } 
      }
      @media print {
        @page{
          size:A4;
          margin:0;
        }
        .relatorio {
          width: 100vw!important; 
          display:flex;
          flex-direction:column;
        }
        div.header{
          display:table-header-group;
        }
        div.body{
          display:table-row-group;
          line-height: normal;
        }
        div.body h1 {
          font-size: 16pt;
        }
    
      }
  `;

    const handlePrintQrCode = useReactToPrint({
        contentRef: ref,
        documentTitle: "QRCode do Paciente",
        removeAfterPrint: true,
        pageStyle: pageStyle
    });

    useEffect(() => {
        setAtualizarTabela(false)
        const fetchData = async () => {
            try {
                setLoading(true);
                await api.get(`/Pacientes/get/${userAcesso?.perfil == 'Admin' ? dadosUsuario?.usuariosId ?? dados?.usuariosId : dadosUsuario?.id ?? dados?.usuariosId}`).then((result) => {
                    result?.data?.receituarios?.map(m => {
                        m.medicamentoFormatado = `${m.medicamento.identificacao} ${m.medicamento.concentracao} ${m.medicamento.unidade}`;
                        m.doseFormatada = `${m.dose} ${m.medicamento.tipoMedicamento}`;
                        m.frequenciaFormatada = `${m.frequencia} ${m.frequencia > 1 ? "vezes" : "vez"} por ${m.tempo.toLowerCase()} pela ${m.periodo.toLowerCase()}`;
                    });
                    result?.data?.cartaoControle?.map(m => {
                        m.data = moment(m.data).format("DD/MM/YYYY")
                        m.dataRetorno = moment(m.dataRetorno).format("DD/MM/YYYY")
                        m.medicamentoFormatado = `${m.medicamento} ${m.concentracao} ${m.unidade}`
                        m.quantidadeFormatada = `${m.quantidade} ${m.tipo}`
                    });
                    result.data?.tratamentos?.map((m) => {
                    m.dataInicioFormatada = moment(m.dataInicio).format("DD/MM/YYYY")
                    m.dataFimFormatada = moment(m.dataFim).format("DD/MM/YYYY")
                    });
                    setDadosPaciente(result.data);
                    setLoading(false);
                });
            } catch (error) {
                showMessage("Aviso", "Erro ao buscar dados: " + error, "error", null);
                setLoading(false);
            }
        };
    
        fetchData();
    }, [dadosUsuario, setDadosUsuario, atualizarTabela]);

    const headersReceituarios = [
        { value: "Medicamento", objectValue: "medicamentoFormatado" },
        { value: "Dose", objectValue: "doseFormatada" },
        { value: "Frequência", objectValue: "frequenciaFormatada" },
    ];

    const headersCartaoControle = [
        { value: "Data", objectValue: "data" },
        { value: "Medicamento", objectValue: "medicamentoFormatado" },
        { value: "Quantidade", objectValue: "quantidadeFormatada" },
        { value: "Retorno", objectValue: "dataRetorno" },
        { value: "Profissional", objectValue: "profissional" },
        { value: "Adicionado Pelo", objectValue: "perfilCadastro" },
    ];

    const headersTratamentos = [
        { value: "Tratamento", objectValue: "identificacao" },
        { value: "Descrição", objectValue: "descricao" },
        { value: "Paciente", objectValue: "paciente" },
        { value: "Patologia", objectValue: "patologia" },
        { value: "CID", objectValue: "cid" },
        { value: "Início", objectValue: "dataInicioFormatada" },
        { value: "Fim", objectValue: "dataFimFormatada" },
        { value: "Status", objectValue: "status" },
    ];

    const handleEditar = (item) => {    
        setDadosRegistroEditar(item)
        setEditarRegistro(true)
    }

    const handleDelete = (item) => {
        showQuestion("Tem certeza?", "Tem certeza que deseja excluir o registro? Esta ação é irreversível", "info",
            (confirmation) => {
                if (confirmation) {
                    setLoading(true);
                    api.delete(`/${item.tabela}/delete`, item.id).then((result) => {
                        if (result.status !== 200) throw new Error("Houve um erro ao tentar excluir o registro!");
                            
                        showMessage( "Sucesso", "Registro excluído com sucesso!", "success", null);
                        setLoading(false);
                        setAtualizarTabela(true)
                    })
                    .catch((err) => {showMessage( "Erro", err, "error", null); setLoading(false)})
                }
            }
        );
    }

    const handleReturnToFicha = () => {
        setAddReceituario(false);
        setAddCartaoControle(false);
        setAddTratamento(false);
        setEditarRegistro(false)
        setAtualizarTabela(true)
    }

    // Ações da tabela
    const actions = [
        { icon: "bi bi-pencil-square text-white", color: "warning", action: handleEditar},
        { icon: "bi bi-x-circle-fill text-white", color: "danger", action: handleDelete},
    ];
    
    if (addReceituario || (editarRegistro && dadosRegistroEditar?.tabela == "Receituario")) 
        return (<AddReceituarios handleReturn={handleReturnToFicha} dadosEdicao={editarRegistro ? dadosRegistroEditar : []} usuarioId={!editarRegistro ? dados?.usuariosId : null} />)
    
    if (addCartaoControle || (editarRegistro && dadosRegistroEditar?.tabela == "CartaoControle")) 
        return (<AddCartaoControle handleReturn={handleReturnToFicha} dadosEdicao={editarRegistro ? dadosRegistroEditar : []}  pacienteId={!editarRegistro ? dados?.id : null} usuariosId={!editarRegistro ? dados?.usuariosId : null} />)
    
    if (addTratamento || (editarRegistro && dadosRegistroEditar?.tabela == "Tratamentos")) 
        return (<AddTratamento handleReturn={handleReturnToFicha} dadosEdicao={editarRegistro ? dadosRegistroEditar : []}  pacienteId={!editarRegistro ? dados?.id : null} />)
    
    const handlePrint = () => {
        const printContents = document.getElementById("printable-area").innerHTML;
        const originalContents = document.body.innerHTML;

        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload();
    }

    return (
        <>
            {loading && <Loading />}
            {cliqueQrCode && 
                <Modals close={setCliqueQrCode} bgColor="#3F8576">
                    <div ref={ref} id="printable-area-qrcode">
                        <Row>
                            <Col className="m-0 p-3" style={{ backgroundColor: "#3F8576"}}>
                                <Row className="justify-content-center m-2">
                                    <Col xs={6} className="d-flex justify-content-center flex-column align-items-center" style={{ borderRadius: "20px", padding: "25px", backgroundColor: "#ffffff" }}>
                                        <h1 className="fw-semibold mt-3 mb-4" style={{ color: "#3F8576" }}>QRCode do Paciente</h1>
                                        <div style={{ height: "auto", margin: "0 auto", maxWidth: 300, width: "100%"}}>
                                            <QRCode
                                                bgColor={"#ffffff"}
                                                fgColor={"#3F8576"}
                                                size={256}
                                                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                                value={`${window.location.origin}/qrCode/Paciente/${dadosUsuario?.hash}`}
                                                viewBox={`0 0 256 256`}
                                                logoImage={Logotipo}
                                                eyeRadius={6}
                                            />
                                        </div>
                                        <h5 className="mt-4 mb-1" style={{color: "#3F8576"}}>Aponte a câmera para escanear</h5>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                    <Row>
                        <Col className="d-flex flex-row align-items-center m-0">
                            <Button variant="light" onClick={handlePrintQrCode}>
                                <i className="bi bi-printer-fill text-success"></i>
                            </Button>
                        </Col>
                    </Row>
                </Modals>
            }
            <div id="printable-area">
                {(userAcesso?.perfil == "Admin" || isQRCode) &&
                    <>
                        {handleReturn &&
                            <Row>
                                <Col>
                                    <Button className="mb-5 mt-2 text-white" variant="secondary" onClick={handleReturn} >
                                        <i className="bi bi-arrow-left"></i> Voltar
                                    </Button>{" "}
                                </Col>
                            </Row>
                        }
                        {isQRCode &&
                            <Row>
                                <Col>
                                    <Button className="mb-1 mt-2 text-white" variant="info" onClick={handlePrint} >
                                        <i className="bi bi-printer-fill"></i> Imprimir
                                    </Button>{" "}
                                </Col>
                            </Row>
                        }
                        <Row>
                            <Col className="d-flex justify-content-center mb-4">
                                <h3>Ficha do Paciente</h3>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="d-flex justify-content-center">
                                <div className="image-container">
                                    <Image
                                        className="profile-image"
                                        roundedCircle
                                        src={`${
                                            (!!dadosUsuario?.usuarios?.imagemPerfil || !!dadosUsuario?.imagemPerfil)
                                            ? (dadosUsuario?.usuarios?.imagemPerfil ?? dadosUsuario?.imagemPerfil)
                                            : "https://medscan-repository.s3.us-east-2.amazonaws.com/uploads/fotos/a2969792-7237-48df-b5f5-3933ef141b6a"
                                        }`}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </>
                }
                <Row className={ userAcesso?.perfil == "Paciente" ? `text-black mb-4 shadow p-3 mb-5 bg-white rounded` : ""} style={{ borderRadius: "15px", padding: "20px" }} >
                    <Col lg="12" sm="12">
                        <span className="fw-semibold">Perfil:</span> <span>Paciente</span>
                    </Col>
                    <Col lg="4" sm="12">
                        <span className="fw-semibold">Nome:</span> <span>{dadosUsuario?.paciente?.nome ?? dadosUsuario?.nome}</span>
                    </Col>
                    <Col lg="4" sm="12">
                        <span className="fw-semibold">Nome Completo:</span> <span>{dadosUsuario?.paciente?.nomeCompleto ?? dadosUsuario?.nomeCompleto}</span>
                    </Col>
                    <Col lg="4" sm="12">
                        <span className="fw-semibold">Data de Nascimento:</span> <span>{moment(dadosUsuario?.paciente?.dataNascimento ?? dadosUsuario?.dataNascimento, "DD/MM/YYYY").format("DD/MM/YYYY")}</span>
                    </Col>
                    <Col lg="4" sm="12">
                        <span className="fw-semibold">E-mail:</span> <span>{dadosUsuario?.paciente?.email ?? dadosUsuario?.email}</span>
                    </Col>
                    <Col lg="4" sm="12">
                        <span className="fw-semibold">E-mail Alternativo:</span> <span>{dadosUsuario?.paciente?.email2 ?? dadosUsuario?.email2}</span>
                    </Col>
                    <Col lg="4" sm="12">
                        <span className="fw-semibold">Código Cadastro:</span> <span>{dadosUsuario?.codigoCadastro}</span>
                    </Col>
                    <Col lg="4" sm="12">
                        <span className="fw-semibold">Endereço:</span> <span>{dadosUsuario?.paciente?.endereco ?? dadosUsuario?.endereco}</span>
                    </Col>
                    <Col lg="4" sm="12">
                        <span className="fw-semibold">Plano de Saúde:</span> <span>{dadosUsuario?.paciente?.planoSaude ?? dadosUsuario?.planoSaude}</span>
                    </Col>
                    <Col lg="4" sm="12">
                        <span className="fw-semibold">CNS:</span> <span>{dadosUsuario?.paciente?.cns ?? dadosUsuario?.cns}</span>
                    </Col>
                    <Col lg="4" sm="12">
                        <span className="fw-semibold">Status:</span> <span>{dadosUsuario?.usuarios?.ativo ?? dadosUsuario?.ativo}</span>
                    </Col>
                </Row>
                <Row>
                    {!isQRCode &&
                        <Col className="d-flex justify-content-center">
                            <OverlayTrigger
                                placement="top"
                                overlay={
                                    <Tooltip id="tooltip-qr">
                                        Visualizar QR Code do Paciente
                                    </Tooltip>
                                }
                            >
                                <i className="bi bi-qr-code fs-1 text-info" onClick={() => setCliqueQrCode(!cliqueQrCode)} style={{ cursor: "pointer" }}></i>
                            </OverlayTrigger>
                        </Col>
                    }
                </Row>
                {(userAcesso?.perfil == "Admin" || isQRCode) && 
                    <Row className="p-3">
                        <Row>
                            <Col>
                                <h4 className="mb-0">Receituários 
                                    {!isQRCode &&
                                        <Button
                                            className="text-white m-2"
                                            variant="info"
                                            style={{ backgroundColor: "#3F8576", borderColor: "#3F8576" }}
                                            onClick={() => setAddReceituario(true)}
                                        >
                                            <i className="bi bi-plus"></i> Adicionar
                                        </Button>
                                    }
                                </h4>
                            </Col>
                            <Row>
                                <TabelaListagem headers={headersReceituarios} itens={dadosPaciente?.receituarios?.map(r => ({...r, tabela: "Receituario"}))} actions={!isQRCode ? actions : []} />
                            </Row>
                        </Row>
                        <Row>
                            <Col>
                                <h4 className="mb-0">Cartão de Controle 
                                    {!isQRCode &&
                                        <Button
                                            className="text-white m-2"
                                            variant="info"
                                            style={{ backgroundColor: "#3F8576", borderColor: "#3F8576" }}
                                            onClick={() => setAddCartaoControle(true)}
                                        >
                                            <i className="bi bi-plus"></i> Adicionar
                                        </Button>
                                    }
                                </h4>
                            </Col>
                            <Row>
                                <TabelaListagem headers={headersCartaoControle} itens={dadosPaciente?.cartaoControle?.map(r => ({...r, tabela: "CartaoControle"}))} actions={!isQRCode ? actions : []} />
                            </Row>
                        </Row>
                        <Row>
                            <Col>
                                <h4 className="mb-0">Tratamentos
                                    {!isQRCode &&
                                        <Button
                                            className="text-white m-2"
                                            variant="info"
                                            style={{ backgroundColor: "#3F8576", borderColor: "#3F8576" }}
                                            onClick={() => setAddTratamento(true)}
                                            >
                                            <i className="bi bi-plus"></i> Adicionar
                                        </Button>
                                    }
                                </h4>
                            </Col>
                            <Row>
                                <TabelaListagem headers={headersTratamentos} itens={dadosPaciente?.tratamentos?.map(r => ({...r, tabela: "Tratamentos"}))} actions={!isQRCode ? actions : []} />
                            </Row>
                        </Row>
                    </Row>
                }
            </div>
        </>
    );
}
