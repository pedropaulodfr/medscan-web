import { useState, useEffect } from "react";

// Bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

// Utils e helpers
import { useApi } from "../api/useApi";
import { showMessage } from "../helpers/message";
import Loading from "../components/Loading/Loading";
import { ValidaCampos } from "../helpers/validacoes";

const Setup = () => {
  const api = useApi();
  const [dadosSetup, setDadosSetup] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [atualizarTabela, setAtualizarTabela] = useState(false);

  // Campos a serem validados
  const campos = [];

  useEffect(() => {
    setAtualizarTabela(false);
    const fetchData = async () => {
      try {
        setLoading(true);
        api.get("/Setup").then((result) => {
          setDadosSetup(result.data);
          setLoading(false);
        });
      } catch (error) {
        showMessage("Aviso", "Erro ao buscar dados: " + error, "error", null);
        setLoading(false);
      }
    };

    fetchData();
  }, [atualizarTabela. dadosSetup, setDadosSetup]);

  const handleDadosSetupChange = (event, campo) => {
    setDadosSetup({
      ...dadosSetup,
      [campo]: event.target.type != "checkbox" ? event.target.value : event.target.checked,
    });
  };

  const handleLimparCampos = () => {
    setDadosSetup({
        urlweb: "",
        urlapi: "",
        caminhoArquivos: "",
        diasNotificacaoRetorno: "",
        usarCodigoCadastro: false
    });
  };

  const onSubmit = () => {
    const newErrors = ValidaCampos(campos, dadosSetup);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors); // Atualiza o estado de erros
      return; // Interrompe a execução
    }

    setLoading(true);
    api
    .put("/Setup/update", dadosSetup)
    .then((result) => {
        if (result.status !== 200)
        throw new Error(result?.response?.data?.message);

        showMessage("Sucesso", "Setup editado com sucesso!", "success", null);
        setLoading(false);
    })
    .catch((err) => {
        showMessage("Erro", err, "error", null);
        setLoading(false);
    });
  };

  return (
    <Container>
      {loading && <Loading />}
      <Row className="justify-content-md-center">
        <Col className="d-flex justify-content-center">
          <h1 className="title-page">Setup</h1>
        </Col>
      </Row>
      <Container className="text-black mb-4 shadow p-3 mb-5 bg-white rounded">
        <Row>
          <Col md>
            <h4>{"Editar"}</h4>
          </Col>
        </Row>
        <Row className="filtros">
          <Col md="4">
            <Form.Group className="mb-3">
              <Form.Label>URL WEB</Form.Label>
              <Form.Control
                type="text"
                placeholder="URL WEB"
                value={dadosSetup?.urlweb}
                onChange={(e) => handleDadosSetupChange(e, "urlweb")}
                isInvalid={!!errors.urlweb}
              />
            </Form.Group>
          </Col>
          <Col md="4">
          <Form.Group className="mb-3">
              <Form.Label>URL API</Form.Label>
              <Form.Control
                type="text"
                placeholder="URL API"
                value={dadosSetup?.urlapi}
                onChange={(e) => handleDadosSetupChange(e, "urlapi")}
                isInvalid={!!errors.urlapi}
              />
            </Form.Group>
          </Col>
          <Col md="4">
            <Form.Group className="mb-3">
              <Form.Label>
                Caminho Arquivos
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Caminho Arquivos"
                value={dadosSetup?.caminhoArquivos}
                onChange={(e) => handleDadosSetupChange(e, "caminhoArquivos")}
                isInvalid={!!errors.caminhoArquivos}
              />
            </Form.Group>
          </Col>
          <Col md="4">
            <Form.Group className="mb-3">
              <Form.Label>
                Prazo Notificação Retorno (Dias)
              </Form.Label>
              <Form.Control
                type="number"
                placeholder="Dias"
                value={dadosSetup?.diasNotificacaoRetorno}
                onChange={(e) => handleDadosSetupChange(e, "diasNotificacaoRetorno")}
                isInvalid={!!errors.diasNotificacaoRetorno}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
            <Col md="4">
                <Form.Group className="mb-3">
                <Form.Label>
                    Usar Código de Cadastro
                </Form.Label>
                <Form.Check
                    type="switch"
                    checked={dadosSetup?.usarCodigoCadastro}
                    onChange={(e) => handleDadosSetupChange(e, "usarCodigoCadastro")}
                    isInvalid={!!errors.usarCodigoCadastro}
                />
                </Form.Group>
            </Col>
            <Col md="4">
                <Form.Group className="mb-3">
                <Form.Label>
                    Análise Automática
                </Form.Label>
                <Form.Check
                    type="switch"
                    checked={dadosSetup?.analiseAutomatica}
                    onChange={(e) => handleDadosSetupChange(e, "analiseAutomatica")}
                    isInvalid={!!errors.analiseAutomatica}
                />
                </Form.Group>
            </Col>
            <Row>
              <Col md>
                <h4>{"Paciente"}</h4>
              </Col>
            </Row>
            <Col md="4">
                <Form.Group className="mb-3">
                <Form.Label>Autocadastro</Form.Label>
                <Form.Check
                    type="switch"
                    checked={dadosSetup?.pacienteAutocadastro}
                    onChange={(e) => handleDadosSetupChange(e, "pacienteAutocadastro")}
                    isInvalid={!!errors.pacienteAutocadastro}
                />
                </Form.Group>
            </Col>
            <Col md="4">
                <Form.Group className="mb-3">
                <Form.Label>Cadastra Receituário</Form.Label>
                <Form.Check
                    type="switch"
                    checked={dadosSetup?.pacienteCadastraReceituario}
                    onChange={(e) => handleDadosSetupChange(e, "pacienteCadastraReceituario")}
                    isInvalid={!!errors.pacienteCadastraReceituario}
                />
                </Form.Group>
            </Col>
            <Col md="4">
                <Form.Group className="mb-3">
                <Form.Label>Cadastra Cartão de Controle</Form.Label>
                <Form.Check
                    type="switch"
                    checked={dadosSetup?.pacienteCadastraCartaoControle}
                    onChange={(e) => handleDadosSetupChange(e, "pacienteCadastraCartaoControle")}
                    isInvalid={!!errors.pacienteCadastraCartaoControle}
                />
                </Form.Group>
            </Col>
            <Col md="4">
                <Form.Group className="mb-3">
                <Form.Label>Cadastra Tratamento</Form.Label>
                <Form.Check
                    type="switch"
                    checked={dadosSetup?.pacienteCadastraTratamento}
                    onChange={(e) => handleDadosSetupChange(e, "pacienteCadastraTratamento")}
                    isInvalid={!!errors.pacienteCadastraTratamento}
                />
                </Form.Group>
            </Col>
        </Row>
        <Row>
          <Col>
            <Button
              className="m-3 mb-0 mt-2 text-white"
              variant="info"
              style={{ backgroundColor: "#3F8576", borderColor: "#3F8576" }}
              onClick={onSubmit}
            >
              <i className="bi bi-plus"></i> Salvar
            </Button>{" "}
            {Object.keys(dadosSetup).length > 0 && (
              <>
                <Button
                  className="m-3 mb-0 mt-2 text-white"
                  variant="info"
                  style={{ backgroundColor: "#50BF84", borderColor: "#50BF84" }}
                  onClick={handleLimparCampos}
                >
                  <i className="bi bi-eraser"></i> Limpar Campos
                </Button>{" "}
              </>
            )}
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default Setup;
