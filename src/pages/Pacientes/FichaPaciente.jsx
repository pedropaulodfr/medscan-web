import { useEffect, useState, useContext } from "react";
import moment from "moment";

// Bootstrap
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

// Utils e helpers
import Loading from "../../components/Loading/Loading";
import { useApi } from "../../api/useApi";
import { showMessage } from "../../helpers/message";
import TabelaListagem from "../../components/TabelaListagem/TabelaListagem";
import AuthContext from "../../contexts/Auth/AuthContext";
import { Button, Image } from "react-bootstrap";


export default function FichaPaciente( { dados = [], handleReturn} ) {
    const api = useApi();
    const { userAcesso } = useContext(AuthContext)
    const [dadosUsuario, setDadosUsuario] = useState(dados)
    const [dadosPaciente, setDadosPaciente] = useState([])
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                await api.get(`/Pacientes/get/${userAcesso?.perfil == 'Admin' ? dadosUsuario?.usuariosId : dadosUsuario?.id}`).then((result) => {
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
    }, [dadosUsuario, setDadosUsuario]);

    console.log(dadosUsuario);

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

    return (
        <>
            {loading && <Loading />}
            {userAcesso?.perfil == "Admin" &&
                <>
                    <Row>
                        <Col>
                            <Button className="mb-5 mt-2 text-white" variant="secondary" onClick={handleReturn} >
                                <i className="bi bi-arrow-left"></i> Voltar
                            </Button>{" "}
                        </Col>
                    </Row>
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
                                        !!dadosUsuario?.usuarios?.imagemPerfil
                                        ? dadosUsuario?.usuarios?.imagemPerfil
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
                    <span className="fw-semibold">Status:</span> <span>{dadosUsuario?.ativo}</span>
                </Col>
            </Row>
            {userAcesso?.perfil == "Admin" &&
                <Row className="p-3">
                    <Row>
                        <h4 className="mb-2">Receituários</h4>
                        <TabelaListagem headers={headersReceituarios} itens={dadosPaciente?.receituarios} />
                    </Row>
                    <Row>
                        <h4 className="mb-2">Cartão de Controle</h4>
                        <TabelaListagem headers={headersCartaoControle} itens={dadosPaciente?.cartaoControle} />
                    </Row>
                    <Row>
                        <h4 className="mb-2">Tratamentos</h4>
                        <TabelaListagem headers={headersTratamentos} itens={dadosPaciente?.tratamentos} />
                    </Row>
                </Row>
            }
        </>
    );
}
