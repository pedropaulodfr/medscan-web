import { useState, useEffect } from "react";

// Bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

// Utils e helpers
import Loading from "../../components/Loading/Loading";
import { showMessage } from "../../helpers/message";
import { ValidaCampos } from "../../helpers/validacoes";
import { useApi } from "../../api/useApi";

const AddMedicamentos = ({ handleReturn, dadosEdicao = [] }) => {
  const api = useApi();
  const [tiposMedicamentos, setTiposMedicamentos] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [_dadosMedicamentos, set_DadosMedicamentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Campos a serem validados
  const campos = [
    { nome: "identificacao", type: "text" },
    { nome: "unidadeId", type: "number" },
    { nome: "concentracao", type: `${_dadosMedicamentos?.associacao ? "text" : "number"}` },
    { nome: "tipoMedicamentoId", type: "number" },
    { nome: "status", type: "text" },
  ];

  // Status
  const listaStatus = ["Ativo", "Inativo"]

  useEffect(() => {
    if (Object.keys(dadosEdicao).length > 0) {
      set_DadosMedicamentos({
        ..._dadosMedicamentos,
        id: dadosEdicao.id,
        identificacao: dadosEdicao.identificacao,
        descricao: dadosEdicao.descricao,
        unidadeId: dadosEdicao.unidadeId,
        concentracao: dadosEdicao.concentracao,
        tipoMedicamentoId: dadosEdicao.tipoMedicamentoId,
        associacao: dadosEdicao.associacao,
        status: dadosEdicao.status
      })
    }
  }, []);

  const handleDadosMedicamentoChange = (event, campo) => {
    set_DadosMedicamentos({
      ..._dadosMedicamentos,
      [campo]: event.target.type != "checkbox" ? event.target.value : event.target.checked,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        api.get("/TipoMedicamentos/getAll").then((result) => {
          const dadosOrdenados = result.data.sort((a, b) => a.identificacao.localeCompare(b.identificacao));
          setTiposMedicamentos(dadosOrdenados);
          setLoading(false);
        });

        api.get("/Unidades/getAll").then((result) => {
          setUnidades(result.data);
          setLoading(false);
        });
      } catch (error) {
        showMessage("Aviso", "Erro ao buscar dados: " + error, "error", null);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLimparCampos = () => {
    set_DadosMedicamentos({identificacao: "", descricao: "", unidadeId: 0, concentracao: "", tipoMedicamentoId: 0, associacao: false, inativo: false});
  };

  const onSubmit = () => {
    const newErrors = ValidaCampos(campos, _dadosMedicamentos);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors); // Atualiza o estado de erros
      return; // Interrompe a execução
    }

    setLoading(true);
    if (Object.keys(dadosEdicao).length == 0) {
      api.post("/Medicamentos/insert", _dadosMedicamentos).then((result) => {
        if (result.status !== 200) throw new Error("Houve um erro ao tentar cadastrar o medicamento!");
  
        showMessage( "Sucesso", "Medicamento cadastrado com sucesso!", "success", null);
        setLoading(false);
        handleLimparCampos();
      })
      .catch((err) => {showMessage( "Erro", err, "error", null); setLoading(false)})
    } else {
      api.put("/Medicamentos/update", _dadosMedicamentos)
        .then((result) => {
          if (result.status !== 200)
            throw new Error("Houve um erro ao tentar editar o medicamento!");
  
          showMessage( "Sucesso", "Medicamento editado com sucesso!", "success", () => {handleReturn()});
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
      <Row >
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

      <Row>
        <Col md="4">
          <Form.Group className="mb-1">
            <Form.Label>
              <span className="text-danger">*</span> Medicamento
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Medicamento"
              value={_dadosMedicamentos?.identificacao}
              onChange={(e) => handleDadosMedicamentoChange(e, "identificacao")}
              isInvalid={!!errors.identificacao}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check 
              type="checkbox" 
              label="Associação" 
              checked={_dadosMedicamentos?.associacao} 
              onChange={(e) => handleDadosMedicamentoChange(e, "associacao")}
            />
          </Form.Group>
        </Col>
        <Col md="4">
          <Form.Group className="mb-3">
            <Form.Label>
              <span className="text-danger">*</span> Concentração
            </Form.Label>
            <Form.Control
              type={_dadosMedicamentos?.associacao ? "text" : "number"}
              placeholder={_dadosMedicamentos?.associacao ? "Concentração + Concentração" : "Concentração"}
              value={_dadosMedicamentos?.concentracao}
              onChange={(e) => handleDadosMedicamentoChange(e, "concentracao")}
              isInvalid={errors.concentracao}
            />
          </Form.Group>
        </Col>
        <Col md="4">
          <Form.Group className="mb-3">
            <Form.Label>
              <span className="text-danger">*</span> Unidade
            </Form.Label>
            <Form.Select
              aria-label="Default select example"
              value={_dadosMedicamentos?.unidadeId}
              onChange={(e) => handleDadosMedicamentoChange(e, "unidadeId")}
              isInvalid={!!errors.unidadeId}
            >
              <option value={0}>Selecione</option>
              {unidades?.map((m, index) => (
                <option key={index} value={m.id}>
                  {m.identificacao}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md="4">
          <Form.Group className="mb-3">
            <Form.Label>Descrição</Form.Label>
            <Form.Control
              type="text"
              placeholder="Descrição"
              value={_dadosMedicamentos?.descricao}
              onChange={(e) => handleDadosMedicamentoChange(e, "descricao")}
            />
          </Form.Group>
        </Col>
        <Col md="4">
          <Form.Group className="mb-3">
            <Form.Label>
              <span className="text-danger">*</span> Tipo
            </Form.Label>
            <Form.Select
              aria-label="Default select example"
              value={_dadosMedicamentos?.tipoMedicamentoId}
              onChange={(e) => handleDadosMedicamentoChange(e, "tipoMedicamentoId")}
              isInvalid={!!errors.tipoMedicamentoId}
            >
              <option value={0}>Selecione</option>
              {tiposMedicamentos?.map((m, index) => (
                <option key={index} value={m.id}>
                  {m.identificacao}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md="4">
          <Form.Group className="mb-3">
            <Form.Label>
              <span className="text-danger">*</span> Status
            </Form.Label>
            <Form.Select
              aria-label="Default select example"
              value={_dadosMedicamentos?.status}
              onChange={(e) => handleDadosMedicamentoChange(e, "status")}
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
        <Col>
          <Button
            className="m-3 mb-0 mt-2 text-white"
            variant="info"
            style={{ backgroundColor: "#3F8576", borderColor: "#3F8576" }}
            onClick={onSubmit}
          >
            <i className="bi bi-plus"></i> Salvar
          </Button>{" "}
          {Object.keys(_dadosMedicamentos).length > 0 && (
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
}

export default AddMedicamentos;