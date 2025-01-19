import { useState, useEffect } from "react";

// Bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

// Utils e helpers
import { useApi } from "../../../api/useApi";
import { showMessage } from "../../../helpers/message";
import Loading from "../../../components/Loading/Loading";
import TabelaListagem from "../../../components/TabelaListagem/TabelaListagem";
import EditarSMTP from "./EditarSMTP";

export default function SMTP() {
  const api = useApi();
  const [dadosSMTP, setDadosSMTP] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editarSMTP, setEditarSMTP] = useState(false);
  const [dadosSMTPEditar, setDadosSMTPEditar] = useState([]);
  const [atualizarTabela, setAtualizarTabela] = useState(false);

  const headers = [
    { value: "Host", objectValue: "smtpHost" },
    { value: "User", objectValue: "smtpUser" },
    { value: "Password", objectValue: "smtpPasswordFormatada" },
    { value: "Port", objectValue: "smtpPort" },
  ];

  const handleEditar = (item) => {
    setDadosSMTPEditar(item);
    setEditarSMTP(true);
  };

  const actions = [{ icon: "bi bi-pencil-square text-white", color: "warning", action: handleEditar, },];

  useEffect(() => {
    setAtualizarTabela(false);
    const fetchData = async () => {
      try {
        setLoading(true);
        api.get("/Setup").then((result) => {
          result.data.smtpPasswordFormatada = "*".repeat(result.data.smtpPassword.length);
          setDadosSMTP([result.data]);
          setLoading(false);
        });
      } catch (error) {
        showMessage("Aviso", "Erro ao buscar dados: " + error, "error", null);
        setLoading(false);
      }
    };

    fetchData();
  }, [atualizarTabela]);

  const handleReturn = () => {
    setEditarSMTP(false);
    setAtualizarTabela(true);
  };

  return (
    <Container>
      {loading && <Loading />}
      <Row className="justify-content-md-center">
        <Col className="d-flex justify-content-center">
          <h1 className="title-page">SMTP</h1>
        </Col>
      </Row>
      {!editarSMTP && (
        <Form className="text-black mb-4 shadow p-3 mb-5 bg-white rounded">
          <Row className="justify-content-center">
            <Col>
              <TabelaListagem headers={headers} itens={dadosSMTP} actions={actions} />
            </Col>
          </Row>
        </Form>
      )}
      {editarSMTP && (
        <Form className="text-black mb-4 shadow p-3 mb-5 bg-white rounded">
          <EditarSMTP handleReturn={handleReturn} dadosEdicao={dadosSMTPEditar} />
        </Form>
      )}
    </Container>
  );
}
