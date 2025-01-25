import { useState, useEffect } from "react";

// Bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

// Utils e helpers
import Loading from "../../components/Loading/Loading";
import { ValidaCampos } from "../../helpers/validacoes";
import { showMessage } from "../../helpers/message";
import { useApi } from "../../api/useApi";

const EditarEmails = ({ handleReturn, dadosEdicao = [] }) => {
  const api = useApi();
  const [dadosEmails, setDadosEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Campos a serem validados
  const campos = [
    { nome: "titulo", type: "text" },
    { nome: "corpo", type: "text" },
    { nome: "status", type: "text" },
  ];

  // Status
  const listaStatus = ["Ativo", "Inativo"]

  useEffect(() => {
    if (Object.keys(dadosEdicao).length > 0) {
      setDadosEmails({
        ...dadosEmails,
        id: dadosEdicao.id,
        identificacao: dadosEdicao.identificacao,
        perfil: dadosEdicao.perfil,
        titulo: dadosEdicao.titulo,
        descricao: dadosEdicao.descricao,
        corpo: dadosEdicao.corpo,
        status: dadosEdicao.status,
      })
    }
  }, []);

  const handleDadosEmailChange = (event, campo) => {
    setDadosEmails({
      ...dadosEmails,
      [campo]: event.target.value,
    });
  };

  const handleLimparCampos = () => {
    setDadosEmails({titulo: "", descricao: "", corpo: "", perfil: "", status: ""});
  };

  const onSubmit = () => {
      const newErrors = ValidaCampos(campos, dadosEmails);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors); // Atualiza o estado de erros
      return; // Interrompe a execução
    }

    if(Object.keys(dadosEdicao).length > 0) {
        setLoading(true);
        api.put("/Emails/update", dadosEmails)
        .then((result) => {
            if (result.status !== 200) throw new Error(result?.response?.data?.message);    

            showMessage( "Sucesso", "E-mail editado com sucesso!", "success", () => {handleReturn()} );
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
            <Form.Label>
              <span className="text-danger">*</span> Identificação
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Identificação"
              disabled={true}
              value={dadosEmails?.identificacao}
              isInvalid={!!errors.identificacao}
            />
          </Form.Group>
        </Col>
        <Col md="4">
          <Form.Group className="mb-3">
            <Form.Label>Perfil</Form.Label>
            <Form.Control
              type="text"
              placeholder="Perfil"
              value={dadosEmails?.perfil}
              onChange={(e) => handleDadosEmailChange(e, "perfil")}
              isInvalid={!!errors.perfil}
            />
          </Form.Group>
        </Col>
        <Col md="4">
          <Form.Group className="mb-3">
            <Form.Label><span className="text-danger">*</span> Título</Form.Label>
            <Form.Control
              type="text"
              placeholder="Título"
              value={dadosEmails?.titulo}
              onChange={(e) => handleDadosEmailChange(e, "titulo")}
              isInvalid={!!errors.titulo}
            />
          </Form.Group>
        </Col>
        <Col md="4">
          <Form.Group className="mb-3">
          <Form.Label>Descrição</Form.Label>
            <Form.Control
              type="text"
              placeholder="Descrição"
              value={dadosEmails?.descricao}
              onChange={(e) => handleDadosEmailChange(e, "descricao")}
              isInvalid={!!errors.descricao}
            />
          </Form.Group>
        </Col>
        <Col md="4">
          <Form.Group className="mb-3">
            <Form.Label><span className="text-danger">*</span> Status</Form.Label>
            <Form.Select
              aria-label="Default select example"
              value={dadosEmails?.status}
              onChange={(e) => handleDadosEmailChange(e, "status")}
              isInvalid={!!errors.status}
              >
              <option value={""}>Selecione</option>
              {listaStatus?.map((m, index) => (
                <option key={index} value={m}>{m}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Form.Group className="mb-3">
            <Form.Label><span className="text-danger">*</span> Corpo</Form.Label>
            <Form.Control as="textarea" rows={20} 
                value={dadosEmails?.corpo}
                onChange={(e) => handleDadosEmailChange(e, "corpo")}
                isInvalid={!!errors.corpo}
            />
        </Form.Group>
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
          {Object.keys(dadosEmails).length > 0 && (
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

export default EditarEmails;
