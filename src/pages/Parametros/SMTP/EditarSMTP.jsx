import { useState, useEffect } from "react";

// Bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

// Utils e helpers
import { useApi } from "../../../api/useApi";
import { showMessage } from "../../../helpers/message";
import Loading from "../../../components/Loading/Loading";
import { ValidaCampos } from "../../../helpers/validacoes";

const EditarSMTP = ({ handleReturn, dadosEdicao = [] }) => {
  const api = useApi();
  const [dadosSMTP, setDadosSMTP] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Estado dos campos
  const [viewPassword, setViewPassword] = useState(false)

  // Campos a serem validados
  const campos = [
    { nome: "smtpHost", type: "text" },
    { nome: "smtpUser", type: "text" },
    { nome: "smtpPassword", type: "text" },
    { nome: "smtpPort", type: "text" },
  ];

  // Status
  const listaStatus = ["Ativo", "Inativo"]

  useEffect(() => {
    if (Object.keys(dadosEdicao).length > 0) {
      setDadosSMTP({
        ...dadosSMTP,
        smtpHost: dadosEdicao.smtpHost,
        smtpUser: dadosEdicao.smtpUser,
        smtpPassword: dadosEdicao.smtpPassword,
        smtpPort: dadosEdicao.smtpPort,
      })
    }
  }, []);

  const handleDadosSMTPChange = (event, campo) => {
    setDadosSMTP({
      ...dadosSMTP,
      [campo]: event.target.value,
    });
  };

  const onChangeViewPassword = () => {
    setViewPassword(!viewPassword)
  }

  const handleLimparCampos = () => {
    setDadosSMTP({smtpHost: "", smtpUser: "", smtpPassword: "", smtpPort: ""});
  };

  const onSubmit = () => {
      const newErrors = ValidaCampos(campos, dadosSMTP);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors); // Atualiza o estado de erros
      return; // Interrompe a execução
    }

    if(Object.keys(dadosEdicao).length > 0) {
        setLoading(true);
        api.put("/Setup/updateSMTP", dadosSMTP)
        .then((result) => {
            if (result.status !== 200) throw new Error(result?.response?.data?.message);    

            showMessage( "Sucesso", "SMTP editado com sucesso!", "success", () => {handleReturn()} );
            setLoading(false);
            handleLimparCampos();
        })
        .catch((err) => {
            showMessage("Erro", err, "error", null);
            setLoading(false);
        });
    }
  };

  return (
    <Container>
      {loading && <Loading />}
      <Row>
        <Col>
          <Button
            className="mb-5 mt-2 text-white"
            variant="secondary"
            onClick={handleReturn}
          >
            <i className="bi bi-arrow-left"></i> Voltar
          </Button>{" "}
        </Col>
      </Row>
      <Row>
        <Col md>
          <h4>{Object.keys(dadosEdicao).length == 0 ? "Cadastrar" : "Editar"}</h4>
        </Col>
      </Row>
      <Row className="filtros">
        <Col md="4">
          <Form.Group className="mb-3">
          <Form.Label><span className="text-danger">*</span> Host</Form.Label>
            <Form.Control
              type="text"
              placeholder="Host"
              value={dadosSMTP?.smtpHost}
              onChange={(e) => handleDadosSMTPChange(e, "smtpHost")}
              isInvalid={!!errors.smtpHost}
            />
          </Form.Group>
        </Col>
        <Col md="4">
          <Form.Group className="mb-3">
            <Form.Label><span className="text-danger">*</span> User</Form.Label>
            <Form.Control
              type="text"
              placeholder="User"
              value={dadosSMTP?.smtpUser}
              onChange={(e) => handleDadosSMTPChange(e, "smtpUser")}
              isInvalid={!!errors.smtpUser}
            />
          </Form.Group>
        </Col>
        <Col md="4">
          <Form.Group className="mb-3">
          <Form.Label><span className="text-danger">*</span> Password</Form.Label>
            <div className="d-flex justify-content-between flex-row align-items-center">
                <Form.Control
                type={viewPassword ? "text" : "password"}
                placeholder="Password"
                value={dadosSMTP?.smtpPassword}
                onChange={(e) => handleDadosSMTPChange(e, "smtpPassword")}
                isInvalid={!!errors.smtpPassword}
                />
                <i class={`bi bi-eye-${viewPassword ? "slash-fill" : "fill"} ms-3`} style={{cursor: "pointer"}} onClick={onChangeViewPassword}></i>
            </div>
          </Form.Group>
        </Col>
        <Col md="4">
          <Form.Group className="mb-3">
          <Form.Label><span className="text-danger">*</span> Port</Form.Label>
            <Form.Control
              type="text"
              placeholder="Port"
              value={dadosSMTP?.smtpPort}
              onChange={(e) => handleDadosSMTPChange(e, "smtpPort")}
              isInvalid={!!errors.smtpPort}
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
          {Object.keys(dadosSMTP).length > 0 && (
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
  );
};

export default EditarSMTP;
