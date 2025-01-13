import { useState, useEffect } from "react";
import moment from "moment";

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
import { getSessionCookie } from "../../helpers/cookies";

const AddCartaoControle = ({ handleReturn, dadosEdicao = [] }) => {
  const api = useApi();
  const [dadosCartaoControle, setdadosCartaoControle] = useState({
    data: moment().format('YYYY-MM-DD'),
    dataRetorno: moment(new Date().setMonth(new Date().getMonth() + 1)).format('YYYY-MM-DD')
  });
  const [listaMedicamentos, setListaMedicamentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    identificacao: false,
  });

  // Estado dos campos
  const [dataRegistro, setDataRegistro] = useState(moment().format('YYYY-MM-DD'));
  const [medicamentoId, setMedicamentoId] = useState(0);
  const [quantidade, setQuantidade] = useState(null);
  const [dataRetorno, setDataRetorno] = useState(moment(new Date().setMonth(new Date().getMonth() + 1)).format('YYYY-MM-DD'));
  const [profissional, setProfissional] = useState("");

  // Campos a serem validados
  const campos = [
    { nome: "data", type: "text" },
    { nome: "quantidade", type: "number" },
    { nome: "medicamentoId", type: "number" },
    { nome: "dataRetorno", type: "text" },
    { nome: "profissional", type: "text" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        api.get("/Medicamentos/getAll").then((result) => {
          const dadosOrdenados = result.data.sort((a, b) => a.identificacao.localeCompare(b.identificacao));
          setListaMedicamentos(dadosOrdenados);
          setLoading(false);
        });
      } catch (error) {
        showMessage("Aviso", "Erro ao buscar dados: " + error, "error", null);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (Object.keys(dadosEdicao).length > 0) {
      setMedicamentoId(dadosEdicao.medicamentoId);
      setDataRegistro(moment(dadosEdicao.data, 'DD/MM/YYYY').format("YYYY-MM-DD"));
      setDataRetorno(moment(dadosEdicao.dataRetorno, 'DD/MM/YYYY').format("YYYY-MM-DD"));
      setQuantidade(dadosEdicao.quantidade);
      setProfissional(dadosEdicao.profissional);

      setdadosCartaoControle({
        ...dadosCartaoControle,
        id: dadosEdicao.id,
        medicamentoId: dadosEdicao.medicamentoId,
        data: moment(dadosEdicao.data, 'DD/MM/YYYY').format("YYYY-MM-DD"),
        dataRetorno: moment(dadosEdicao.dataRetorno, 'DD/MM/YYYY').format("YYYY-MM-DD"),
        quantidade: dadosEdicao.quantidade,
        profissional: dadosEdicao.profissional,
        usuarioId: getSessionCookie()?.usuario_Id
      });
    }
  }, []);

  const handleMedicamentoChange = (event) => {
    setMedicamentoId(event.target.value);
    setdadosCartaoControle({
      ...dadosCartaoControle,
      medicamentoId: event.target.value,
    });
  };

  const handleDataRegistroChange = (event) => {
    setDataRegistro(event.target.value);
    setdadosCartaoControle({
      ...dadosCartaoControle,
      data: event.target.value,
    });
  };

  const handleDataRetornoChange = (event) => {
    setDataRetorno(event.target.value);
    setdadosCartaoControle({
      ...dadosCartaoControle,
      dataRetorno: event.target.value,
    });
  };

  const handleQuantidadeChange = (event) => {
    setQuantidade(event.target.value);
    setdadosCartaoControle({
      ...dadosCartaoControle,
      quantidade: event.target.value,
    });
  };

  const handleProfissionalChange = (event) => {
    setProfissional(event.target.value);
    setdadosCartaoControle({
      ...dadosCartaoControle,
      profissional: event.target.value,
    });
  };

  const handleLimparCampos = () => {
    setDataRegistro("");
    setMedicamentoId(0);
    setQuantidade("");
    setDataRetorno("");
    setProfissional("");
    setdadosCartaoControle({});
  };

  const onSubmit = () => {
    const newErrors = ValidaCampos(campos, dadosCartaoControle);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors); // Atualiza o estado de erros
      return; // Interrompe a execução
    }

    const _dadosCartaoControle = {
      ...dadosCartaoControle,
      usuarioId: getSessionCookie()?.usuario_Id
    }

    if (Object.keys(dadosEdicao).length == 0) {
      setLoading(true);
      api.post("/CartaoControle/insert", _dadosCartaoControle)
        .then((result) => {
          if (result.status !== 200)
            throw new Error(result?.response?.data?.message);

          showMessage("Sucesso", "Registro cadastrado com sucesso!", "success", null);
          setLoading(false);
          handleLimparCampos();
        })
        .catch((err) => {
          showMessage("Erro", err, "error", null);
          setLoading(false);
        });
    } else {
      setLoading(true);
      api.put("/CartaoControle/update", _dadosCartaoControle)
        .then((result) => {
          if (result.status !== 200)
            throw new Error(result?.response?.data?.message);

          showMessage("Sucesso", "Registro editado com sucesso!", "success", () => {handleReturn()});

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
          <h4>
            {Object.keys(dadosEdicao).length == 0 ? "Cadastrar" : "Editar"}
          </h4>
        </Col>
      </Row>
      <Row className="filtros">
        <Col md="4">
          <Form.Group controlId="date" bsSize="large">
            <Form.Label><span className="text-danger">*</span> Data</Form.Label>
            <Form.Control
              type="date"
              style={{ width: "100%" }}
              value={dataRegistro}
              onChange={(e) => {handleDataRegistroChange(e)}}
              isInvalid={!!errors.data}
            />
          </Form.Group>
        </Col>
        <Col md="4">
          <Form.Group className="mb-3">
            <Form.Label>
              <span className="text-danger">*</span> Medicamento
            </Form.Label>
            <Form.Select
              aria-label="Default select example"
              value={medicamentoId}
              onChange={(e) => handleMedicamentoChange(e)}
              isInvalid={!!errors.medicamentoId}
            >
              <option value={0}>Selecione</option>
              {listaMedicamentos?.map((m, index) => (
                <option key={index} value={m.id}>
                  {m.identificacao} {m.concentracao} {m.unidade}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md="4">
          <Form.Group className="mb-3">
            <Form.Label>
              <span className="text-danger">*</span> Quantidade
            </Form.Label>
            <Form.Control
              type="number"
              placeholder="Quantidade"
              value={quantidade}
              onChange={(e) => {handleQuantidadeChange(e)}}
              isInvalid={!!errors.quantidade}
            />
          </Form.Group>
        </Col>
        <Col md="4">
          <Form.Group controlId="date" bsSize="large">
            <Form.Label><span className="text-danger">*</span> Data de Retorno</Form.Label>
            <Form.Control
              type="date"
              style={{ width: "100%" }}
              value={dataRetorno}
              onChange={(e) => {handleDataRetornoChange(e)}}
              isInvalid={!!errors.dataRetorno}
            />
          </Form.Group>
        </Col>
        <Col md="4">
          <Form.Group className="mb-3">
            <Form.Label>
              <span className="text-danger">*</span> Profissional
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Profissional"
              value={profissional}
              onChange={(e) => {handleProfissionalChange(e)}}
              isInvalid={!!errors.profissional}
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
          {Object.keys(dadosCartaoControle).length > 0 && (
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

export default AddCartaoControle;
