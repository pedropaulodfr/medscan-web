import { useState, useEffect, useContext } from "react";

// Bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

// Utils e helpers
import Loading from "../../components/Loading/Loading";
import TabelaListagem from "../../components/TabelaListagem/TabelaListagem";
import { showMessage, showQuestion } from "../../helpers/message";
import { useApi } from "../../api/useApi";
import AuthContext from "../../contexts/Auth/AuthContext";
import moment from "moment";
import AddTratamentos from "./AddTratamentos";

export default function Tratamentos() {
  const api = useApi();
  const { userAcesso } = useContext(AuthContext)
  const [dadosTratamentos, setDadosTratamentos] = useState([]);
  const [_dadosTratamentos, set_DadosTratamentos] = useState([]);
  const [filtro, setFiltro] = useState({});
  const [isFiltro, setIsFiltro] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addTratamentos, setAddTratamentos] = useState(false);
  const [editarTratamentos, setEditarTratamentos] = useState(false);
  const [dadosTratamentoEditar, setDadosTratamentoEditar] = useState([]);
  const [atualizarTabela , setAtualizarTabela]  = useState(false);
  const [pacienteCadastraTratamento, setPacienteCadastraTratamento] = useState(false);

  const headers = [
    { value: "Tratamento", objectValue: "identificacao" },
    { value: "Descrição", objectValue: "descricao" },
    // { value: "Paciente", objectValue: "paciente" }, Somente para Admin
    { value: "Patologia", objectValue: "patologia" },
    { value: "CID", objectValue: "cid" },
    { value: "Início", objectValue: "dataInicioFormatada" },
    { value: "Fim", objectValue: "dataFimFormatada" },
    { value: "Status", objectValue: "status" },
  ];

  const handleDelete = (item) => {
    showQuestion("Tem certeza?", "Tem certeza que deseja excluir o registro? Esta ação é irreversível", "info",
      (confirmation) => {
        if (confirmation) {
          setLoading(true);
          api.delete("/Tratamentos/delete", item.id).then((result) => {
            if (result.status !== 200) throw new Error(result?.response?.data?.message);
              
            showMessage( "Sucesso", "Tratamento deletado com sucesso!", "success", null);
            setLoading(false);
            setAtualizarTabela(true)
          })
          .catch((err) => {showMessage( "Erro", err, "error", null); setLoading(false)})
        }
      }
    );
  }
  
  const handleEditar = (item) => {
    setDadosTratamentoEditar(item)
    setEditarTratamentos(true)
  }
 
  const actions = [
    { icon: "bi bi-pencil-square text-white", color: "warning", action: handleEditar},
    { icon: "bi bi-x-circle-fill text-white", color: "danger", action: handleDelete},
  ];

  useEffect(() => {
    setAtualizarTabela(false)
    const fetchData = async () => {
      try {
        setLoading(true);
        api.get(`/Tratamentos/${userAcesso?.pacienteId}`).then((result) => {
          result.data?.map((m) => {
            m.dataInicioFormatada = moment(m.dataInicio).format("DD/MM/YYYY")
            m.dataFimFormatada = moment(m.dataFim).format("DD/MM/YYYY")
          });

          setDadosTratamentos(result.data);
          set_DadosTratamentos(result.data);
          setLoading(false);
        });

        await api.get(`/Setup`).then((result) => {
            setPacienteCadastraTratamento(result?.data?.pacienteCadastraTratamento);
            setLoading(false);
        });
      } catch (error) {
        showMessage("Aviso", "Erro ao buscar dados: " + error, "error", null);
        setLoading(false);
      }
    };

    fetchData();
  }, [addTratamentos, setAddTratamentos, atualizarTabela]);

  // Filtros
  const camposFiltrados = [
    {campo: "identificacao", label: "Identificação", tipo: "text"},
    // {campo: "paciente", label: "Paciente", tipo: "text"}, Somente para Admin
    {campo: "patologia", label: "Patologia", tipo: "text"},
    {campo: "cid", label: "CID", tipo: "text"},
  ]

  const handleFiltroChange = (event, campo) => {
    let newValue;
    if (event.target.type == "checkbox") {
        newValue = event.target.checked;
    } else {
        newValue = event.target.value;
    }
    setFiltro({ ...filtro,[campo]: newValue, });
  };

  const handleFiltro = () => {
    // Resetar os dados para o estado original
    setDadosTratamentos(dadosTratamentos);

    // Verificar se algum filtro foi preenchido
    if (Object.keys(filtro).length === 0) {
      showMessage("Aviso", "Informe ao menos um dos campos!", "error", null);
      return;
    }

    // Criar uma cópia dos dados originais para aplicar os filtros
    let dadosFiltrados = [...dadosTratamentos];

    // Aplicar os filtros dinamicamente com base na lista de filtros
    for (const campo in filtro) {
        if (filtro[campo] && filtro[campo]?.trim() !== "") {
            dadosFiltrados = dadosFiltrados?.filter((item) =>
                item[campo] 
                ? item[campo].toString().toLowerCase().includes(filtro[campo]?.trim().toLowerCase())
                : false
            );
        }
    }

    setIsFiltro(true);
    setDadosTratamentos(dadosFiltrados);
  };

  const handleLimparFiltro = () => {
    setDadosTratamentos(_dadosTratamentos);
    setIsFiltro(false);
  };

  const handleaddTratamentos = () => {
    setAddTratamentos(true);
  };

  const handleReturn = () => {
    setAddTratamentos(false)
    setEditarTratamentos(false)
    setAtualizarTabela(true)
  }

  return (
    <Container>
      {loading && <Loading />}
      <Row className="justify-content-md-center">
        <Col className="d-flex justify-content-center">
          <h1 className="title-page">Tratamentos</h1>
        </Col>
      </Row>
      {!addTratamentos && !editarTratamentos && (
        <>
          <Row>
            <Col md>
              <h4>Filtros</h4>
            </Col>
          </Row>
          <Form className="text-black mb-4 shadow p-3 mb-5 bg-white rounded">
            <Row className="filtros">
                {camposFiltrados != null &&
                    camposFiltrados?.map(m => {
                        return (
                            <Col md="4">
                                <Form.Group className="mb-3">
                                <Form.Label>{m.label}</Form.Label>
                                <Form.Control
                                    type={m.tipo}
                                    placeholder=""
                                    value={filtro[m.campo] || ""}
                                    onChange={(e) => handleFiltroChange(e, m.campo)}
                                />
                                </Form.Group>
                            </Col>
                        )
                    })
                }
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
          </Form>
          {!addTratamentos && !editarTratamentos && ((userAcesso?.perfil == "Paciente" && pacienteCadastraTratamento) || userAcesso?.perfil == "Admin") &&  (
            <Row>
              <Col>
                <Button
                  className="m-3 mb-0 mt-2 text-white"
                  variant="info"
                  style={{ backgroundColor: "#3F8576", borderColor: "#3F8576" }}
                  onClick={handleaddTratamentos}
                >
                  <i className="bi bi-plus"></i> Cadastrar
                </Button>{" "}
              </Col>
            </Row>
          )}
          <Form className="text-black mb-4 shadow p-3 mb-5 bg-white rounded">
            <Row className="justify-content-center">
              <Col>
                <TabelaListagem headers={headers} itens={dadosTratamentos} actions={pacienteCadastraTratamento ? actions : []} />
              </Col>
            </Row>
          </Form>
        </>
      )}
      {addTratamentos && (
        <Form className="text-black mb-4 shadow p-3 mb-5 bg-white rounded">
          <AddTratamentos handleReturn={handleReturn} />
        </Form>
      )}
      {editarTratamentos && (
        <Form className="text-black mb-4 shadow p-3 mb-5 bg-white rounded">
          <AddTratamentos handleReturn={handleReturn} dadosEdicao={dadosTratamentoEditar} />
        </Form>
      )}
    </Container>
  );
}
