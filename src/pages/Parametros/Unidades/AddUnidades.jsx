import { useState, useEffect } from "react";
import axios from "axios";

// Bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

// Utils e helpers
import Loading from "../../../components/Loading/Loading";
import { showMessage } from "../../../helpers/message";
import { ValidaCampos } from "../../../helpers/validacoes";
import { useApi } from "../../../api/useApi";

const AddUnidades = ({ handleReturn, dadosEdicao = [] }) => {
  const api = useApi();
  const [dadosUnidades, setDadosUnidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    identificacao: false,
  });

  // Estado dos campos
  const [unidade, setUnidade] = useState("");
  const [descricao, setDescricao] = useState("");

  // Campos a serem validados
  const campos = [{ nome: "identificacao", type: "text" }];

  useEffect(() => {
    if (Object.keys(dadosEdicao).length > 0) {
      setUnidade(dadosEdicao.identificacao)
      setDescricao(dadosEdicao.descricao)

      setDadosUnidades({
        ...dadosUnidades,
        id: dadosEdicao.id,
        identificacao: dadosEdicao.identificacao,
        descricao: dadosEdicao.descricao
      })
    }
  }, []);

  const handleUnidadeChange = (event) => {
    setUnidade(event.target.value);
    setDadosUnidades({
      ...dadosUnidades,
      identificacao: event.target.value,
    });
  };

  const handleDescricaoChange = (event) => {
    setDescricao(event.target.value);
    setDadosUnidades({
      ...dadosUnidades,
      descricao: event.target.value,
    });
  };

  const handleLimparCampos = () => {
    setUnidade("");
    setDescricao("");
    setDadosUnidades({});
  };

  const onSubmit = () => {
    const newErrors = ValidaCampos(campos, dadosUnidades);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors); // Atualiza o estado de erros
      return; // Interrompe a execução
    }

    setLoading(true);
    if(Object.keys(dadosEdicao).length == 0)
    {
      api.post("/Unidades/insert", dadosUnidades)
        .then((result) => {
          if (result.status !== 200)
            throw new Error("Houve um erro ao tentar cadastrar a unidade!");
  
          showMessage(
            "Sucesso",
            "Unidade cadastrada com sucesso!",
            "success",
            null
          );
          setLoading(false);
          handleLimparCampos();
        })
        .catch((err) => {
          showMessage("Erro", err, "error", null);
          setLoading(false);
        });
      } else {
      api.put("/Unidades/update", dadosUnidades)
        .then((result) => {
          if (result.status !== 200)
            throw new Error("Houve um erro ao tentar editar a unidade!");
  
          showMessage(
            "Sucesso",
            "Unidade editada com sucesso!",
            "success",
            () => {handleReturn()}
          );
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
              <span className="text-danger">*</span> Sigla Unidade
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Unidade"
              value={unidade}
              onChange={(e) => {
                handleUnidadeChange(e);
              }}
              isInvalid={!!errors.identificacao}
            />
          </Form.Group>
        </Col>
        <Col md="4">
          <Form.Group className="mb-3">
            <Form.Label>Descrição</Form.Label>
            <Form.Control
              type="text"
              placeholder="Descrição"
              value={descricao}
              onChange={(e) => {
                handleDescricaoChange(e);
              }}
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
          {Object.keys(dadosUnidades).length > 0 && (
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

export default AddUnidades;
