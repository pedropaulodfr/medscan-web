import { useState, useEffect, useContext } from "react";

// Bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import TabelaListagem from "../../components/TabelaListagem/TabelaListagem";
import Form from "react-bootstrap/Form";

// Utils e helpers
import Loading from "../../components/Loading/Loading";
import { showMessage, showQuestion } from "../../helpers/message";
import AddSolicitacaoMedicamento from "./AddSolicitacaoMedicamento";
import { useApi } from "../../api/useApi";
import AuthContext from "../../contexts/Auth/AuthContext";

export default function SolicitacaoMedicamento() {
  const api = useApi();
  const { userAcesso } = useContext(AuthContext);
  const [dadosSolicitacoesMedicamentos, setDadosSolicitacoesMedicamentos] = useState([]);
  const [_dadosSolicitacoesMedicamentos, set_DadosSolicitacoesMedicamentos] = useState([]);
  const [isFiltro, setIsFiltro] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addSolicitacaoMedicamento, setAddSolicitacaoMedicamento] = useState(false);
  const [editarSolicitacaoMedicamento, seteditarSolicitacaoMedicamento] = useState(false);
  const [dadosSolicitacaoMedicamentoEditar, setDadosSolicitacaoMedicamentoEditar] = useState([]);
  const [atualizarTabela , setAtualizarTabela]  = useState(false);

  const headers = [
    { value: "Medicamento", objectValue: "identificacao" },
    { value: "Concentração", objectValue: "concentracaoUnidade" },
    { value: "Descrição", objectValue: "descricao" },
    { value: "Tipo", objectValue: "tipoMedicamento" },
    { value: "Status", objectValue: "status" },
  ];

  const handleDelete = (item) => {
    showQuestion("Tem certeza?", "Tem certeza que deseja excluir o registro? Esta ação é irreversível", "info",
      (confirmation) => {
        if (confirmation) {
          setLoading(true);
          api.delete("/Solicitacoes/delete", item.id).then((result) => {
            if (result.status !== 200) throw new Error(result?.response?.data?.message);
              
            showMessage( "Sucesso", "Solicitacao de medicamento deletada com sucesso!", "success", null);
            setLoading(false);
            setAtualizarTabela(true)
          })
          .catch((err) => {showMessage( "Erro", err, "error", null); setLoading(false)})
        }
      }
    );
  }
  
  const handleEditar = (item) => {
    setDadosSolicitacaoMedicamentoEditar(item)
    seteditarSolicitacaoMedicamento(true)
  }

  // Açõeas da tabela
  const actions = [{ icon: "bi bi-x-circle-fill text-white", color: "danger", action: handleDelete}];

  // Filtros
  const [medicamentoFiltro, setMedicamentoFiltro] = useState("");

  const handleMedicamentoChange = (event) => {
    setMedicamentoFiltro(event.target.value);
  };


  useEffect(() => {
    setAtualizarTabela(false)
    const fetchData = async () => {
      try {
        setLoading(true);
        api.get(`/Solicitacoes/getAll/Todos/${userAcesso?.pacienteId}`).then((result) => {
          result.data?.map((m) => {
            m.concentracaoUnidade = `${m.concentracao} ${m.unidade}`;
          });

          const dadosOrdenados = result.data?.sort((a, b) => a.identificacao?.localeCompare(b.identificacao));
          setDadosSolicitacoesMedicamentos(dadosOrdenados);
          set_DadosSolicitacoesMedicamentos(dadosOrdenados);
          setLoading(false);
        });
      } catch (error) {
        showMessage("Aviso", "Erro ao buscar dados: " + error, "error", null);
        setLoading(false);
      }
    };

    fetchData();
  }, [addSolicitacaoMedicamento, setAddSolicitacaoMedicamento, atualizarTabela]);

  const handleFiltro = () => {
    // Resetar os dados para o estado original
    setDadosSolicitacoesMedicamentos(dadosSolicitacoesMedicamentos);

    // Verificar se algum filtro foi preenchido
    if (medicamentoFiltro === "") {
      showMessage("Aviso", "Informe ao menos um dos campos!", "error", null);
      return;
    }

    // Criar uma cópia dos dados originais para aplicar os filtros
    let dadosFiltrados = [...dadosSolicitacoesMedicamentos];

    if (medicamentoFiltro.trim() !== "") {
      dadosFiltrados = dadosFiltrados.filter((item) =>
        item.identificacao
          .toLowerCase()
          .includes(medicamentoFiltro.trim().toLowerCase())
      );
    }

    setIsFiltro(true);
    setDadosSolicitacoesMedicamentos(dadosFiltrados);
  };

  const handleLimparFiltro = () => {
    setMedicamentoFiltro("");
    setDadosSolicitacoesMedicamentos(_dadosSolicitacoesMedicamentos);
    setIsFiltro(false);
  };

  const handleaddSolicitacaoMedicamento = () => {
    setAddSolicitacaoMedicamento(true);
  };

  const handleReturn = () => {
    setAddSolicitacaoMedicamento(false)
    seteditarSolicitacaoMedicamento(false)
    setAtualizarTabela(true)
  }

  return (
    <Container>
      {loading && <Loading />}
      <Row className="justify-content-md-center">
        <Col className="d-flex justify-content-center">
          <h1 className="title-page">Solicitação de Medicamentos</h1>
        </Col>
      </Row>
      {!addSolicitacaoMedicamento && !editarSolicitacaoMedicamento && (
        <>
          <Row>
            <Col md>
              <h4>Filtros</h4>
            </Col>
          </Row>
          <Form className="text-black mb-4 shadow p-3 mb-5 bg-white rounded">
            <Row className="filtros">
              <Col md="3">
                <Form.Group className="mb-3">
                  <Form.Label>Medicamento</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    value={medicamentoFiltro}
                    onChange={(e) => {handleMedicamentoChange(e)}}
                  />
                </Form.Group>
              </Col>
              <Col className=" mt-4" xs={0}>
                <Button
                  className="mb-0 mt-2 text-white"
                  variant="info"
                  style={{ backgroundColor: "#3F8576", borderColor: "#3F8576" }}
                  onClick={handleFiltro}
                >
                  <i className="bi bi-funnel"></i> Filtrar
                </Button>{" "}
                {isFiltro && (
                  <>
                    <Button
                      className="m-3 mb-0 mt-2 text-white"
                      variant="info"
                      style={{backgroundColor: "#50BF84", borderColor: "#50BF84",}}
                      onClick={handleLimparFiltro}
                    >
                      <i className="bi bi-eraser"></i> Limpar Filtros
                    </Button>{" "}
                  </>
                )}
              </Col>
            </Row>
            <Row>
            </Row>
          </Form>
          {!addSolicitacaoMedicamento && !editarSolicitacaoMedicamento && (
            <Row>
              <Col>
                <Button
                  className="m-3 mb-0 mt-2 text-white"
                  variant="info"
                  style={{ backgroundColor: "#3F8576", borderColor: "#3F8576" }}
                  onClick={handleaddSolicitacaoMedicamento}
                >
                  <i className="bi bi-plus"></i> Cadastrar
                </Button>{" "}
              </Col>
            </Row>
          )}
          <Form className="text-black mb-4 shadow p-3 mb-5 bg-white rounded">
            <Row className="justify-content-center">
              <Col>
                <TabelaListagem headers={headers} itens={dadosSolicitacoesMedicamentos} actions={actions} />
              </Col>
            </Row>
          </Form>
        </>
      )}
      {addSolicitacaoMedicamento && (
        <Form className="text-black mb-4 shadow p-3 mb-5 bg-white rounded">
          <AddSolicitacaoMedicamento handleReturn={handleReturn} />
        </Form>
      )}
      {editarSolicitacaoMedicamento && (
        <Form className="text-black mb-4 shadow p-3 mb-5 bg-white rounded">
          <AddSolicitacaoMedicamento handleReturn={handleReturn} dadosEdicao={dadosSolicitacaoMedicamentoEditar} />
        </Form>
      )}
    </Container>
  );
}
