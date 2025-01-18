import { useState, useEffect } from "react";

// Bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

// Utils e helpers
import { showMessage } from "../../helpers/message";
import TabelaListagem from "../../components/TabelaListagem/TabelaListagem";
import Loading from "../../components/Loading/Loading";
import { useApi } from "../../api/useApi";
import EditarEmails from "./EditarEmails";

export default function Emails() {
  const api = useApi();
  const [dadosEmails, setDadosEmails] = useState([]);
  const [_dadosEmails, set_DadosEmails] = useState([]);
  const [isFiltro, setIsFiltro] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editarEmail, setEditarEmail] = useState(false);
  const [dadosEmailEditar, setDadosEmailEditar] = useState([]);
  const [atualizarTabela, setAtualizarTabela] = useState(false);

  const headers = [
    { value: "Tipo", objectValue: "identificacao" },
    { value: "Título", objectValue: "titulo" },
    { value: "Descrição", objectValue: "descricao" },
    { value: "Status", objectValue: "status" },
  ];

  const handleEditar = (item) => {
    setDadosEmailEditar(item);
    setEditarEmail(true);
  };

  const actions = [
    {
      icon: "bi bi-pencil-square text-white",
      color: "warning",
      action: handleEditar,
    },
  ];

  // Filtros
  const [emailFiltro, setUnidadeFiltro] = useState("");

  const handleEmailChange = (event) => {
    setUnidadeFiltro(event.target.value);
  };

  useEffect(() => {
    setAtualizarTabela(false);
    const fetchData = async () => {
      try {
        setLoading(true);
        api.get("/Emails/getAll").then((result) => {
          set_DadosEmails(result.data);
          setDadosEmails(result.data);
          setLoading(false);
        });
      } catch (error) {
        showMessage("Aviso", "Erro ao buscar dados: " + error, "error", null);
        setLoading(false);
      }
    };

    fetchData();
  }, [atualizarTabela]);

  const handleFiltro = () => {
    // Resetar os dados para o estado original
    setDadosEmails(dadosEmails);

    // Verificar se algum filtro foi preenchido
    if (emailFiltro === "") {
      showMessage("Aviso", "Informe ao menos um dos campos!", "error", null);
      return;
    }

    // Criar uma cópia dos dados originais para aplicar os filtros
    let dadosFiltrados = [...dadosEmails];

    if (emailFiltro.trim() !== "") {
      dadosFiltrados = dadosFiltrados.filter((item) =>
        item.identificacao
          .toLowerCase()
          .includes(emailFiltro.trim().toLowerCase())
      );
      dadosFiltrados.sort((a, b) => {
        return a.identificacao - b.identificacao;
      });
    }

    setIsFiltro(true);
    setDadosEmails(dadosFiltrados);
  };

  const handleLimparFiltro = () => {
    setUnidadeFiltro("");
    setDadosEmails(_dadosEmails);
    setIsFiltro(false);
  };

  const handleReturn = () => {
    setEditarEmail(false);
    setAtualizarTabela(true);
  };

  return (
    <Container>
      {loading && <Loading />}
      <Row className="justify-content-md-center">
        <Col className="d-flex justify-content-center">
          <h1 className="title-page">E-mails</h1>
        </Col>
      </Row>
      {!editarEmail && (
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
                  <Form.Label>Tipo</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    value={emailFiltro}
                    onChange={(e) => {
                      handleEmailChange(e);
                    }}
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
                      style={{
                        backgroundColor: "#50BF84",
                        borderColor: "#50BF84",
                      }}
                      onClick={handleLimparFiltro}
                    >
                      <i className="bi bi-eraser"></i> Limpar Filtros
                    </Button>{" "}
                  </>
                )}
              </Col>
            </Row>
            <Row></Row>
          </Form>
          <Form className="text-black mb-4 shadow p-3 mb-5 bg-white rounded">
            <Row className="justify-content-center">
              <Col>
                <TabelaListagem
                  headers={headers}
                  itens={dadosEmails}
                  actions={actions}
                />
              </Col>
            </Row>
          </Form>
        </>
      )}
      {editarEmail && (
        <Form className="text-black mb-4 shadow p-3 mb-5 bg-white rounded">
          <EditarEmails
            handleReturn={handleReturn}
            dadosEdicao={dadosEmailEditar}
          />
        </Form>
      )}
    </Container>
  );
}
