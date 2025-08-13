import { useState, useEffect, useContext } from "react";
import moment from "moment";

// Bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

// Utils e helpers
import Loading from "../../components/Loading/Loading";
import Input from "../../components/Inputs/Inputs";
import { showMessage } from "../../helpers/message";
import { ValidaCampos } from "../../helpers/validacoes";
import { useApi } from "../../api/useApi";
import AuthContext from "../../contexts/Auth/AuthContext";
import InputWithButtons from "../../components/Inputs/InputWithButtons";

const AddTratamentos = ({ handleReturn, dadosEdicao = [], pacienteId = null }) => {
  const api = useApi();
  const { userAcesso } = useContext(AuthContext);
  const [dadosTratamento, setDadosTratamento] = useState({});
  const [listaReceituariosPaciente, setListaReceituariosPaciente] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const listaStatus = ["Ativo", "Concluído"]

  const addCampos = [
    {name: "identificacao", label: "Identificação", placeholder: "Identificação", type: "text" , obrigatorio: true, disabled: false, hide: false},
    {name: "descricao", label: "Descrição", placeholder: "Descrição", type: "text",  obrigatorio: true,  disabled: false, hide: false},
    {name: "patologia", label: "Patologia", placeholder: "Patologia", type: "text",  obrigatorio: false,  disabled: false, hide: false},
    {name: "cid", label: "CID", placeholder: "CID", type: "text",  obrigatorio: false,  disabled: false, hide: false},
    {name: "profissionalResponsavel", label: "Profissional Responsável", placeholder: "Profissional Responsável", type: "text",  obrigatorio: false,  disabled: false, hide: false},
    {name: "dataInicio", label: "Início", placeholder: "Data Início", type: "date",  obrigatorio: true, disabled: false, hide: false},
    {name: "dataFim", label: "Fim", placeholder: "Data Fim", type: "date",  obrigatorio: true, disabled: false, hide: false},
    {name: "status", label: "Status", placeholder: "Status", type: "select",  obrigatorio: true, disabled: false, hide: false, options: {type: "array", selects: listaStatus} },
  ]

  // Campos a serem validados
  const campos = [
    { nome: "identificacao", type: "text" },
    { nome: "descricao", type: "text" },
    { nome: "dataInicio", type: "text" },
    { nome: "dataFim", type: "text" },
    { nome: "status", type: "text" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const _pacienteId = pacienteId != null ? pacienteId : userAcesso?.pacienteId;
        await api.get(`/Receituario/get/${_pacienteId}`).then((result) => {
          const listaOrdenada = result.data.sort((a, b) => a.medicamento?.identificacao.localeCompare(b.medicamento?.identificacao));
          setListaReceituariosPaciente(listaOrdenada);
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
      setDadosTratamento({
        ...dadosTratamento,
        id: dadosEdicao.id,
        identificacao: dadosEdicao.identificacao,
        descricao: dadosEdicao.descricao,
        patologia: dadosEdicao.patologia,
        cid: dadosEdicao.cid,
        profissionalResponsavel: dadosEdicao.profissionalResponsavel,
        dataInicio: moment(dadosEdicao.dataInicioFormatada, "DD/MM/YYYY").format("YYYY-MM-DD"),
        dataFim: moment(dadosEdicao.dataFimFormatada, "DD/MM/YYYY").format("YYYY-MM-DD"),
        status: dadosEdicao.status
      });
    }
  }, []);

  const handleDadosTratamentoChange = (event) => {
    const campo = event.target.name;
    setDadosTratamento({
      ...dadosTratamento,
      [campo]: event.target.type != "checkbox" ? event.target.value : event.target.checked,
    });
  };

  const handleAddReceituarioTratamento = (event) => {
    const idSelecionado = event.target.value;
    if (!idSelecionado) return;

    // Busca o receituário selecionado na lista de receituários do paciente
    const receituarioSelecionado = listaReceituariosPaciente.find(m => m.id == idSelecionado);

    // Monta o objeto 
    const novoReceituario = {
      id: receituarioSelecionado.id,
      nome: `${receituarioSelecionado.medicamento?.identificacao} ${receituarioSelecionado.medicamento?.concentracao} ${receituarioSelecionado.medicamento?.unidade}, ${receituarioSelecionado.medicamento?.tipoMedicamento}, 
        ${receituarioSelecionado.frequencia} ${receituarioSelecionado.frequencia > 1 ? "vezes" : "vez"} por ${receituarioSelecionado.tempo.toLowerCase()} pela ${receituarioSelecionado.periodo.toLowerCase()}`
    };

    // Evita duplicidade
    if (!receituariosVinculados.some(r => r.id === novoReceituario.id)) {
      setReceituariosVinculados([...receituariosVinculados, novoReceituario]);
    }
  }

  const handleLimparCampos = () => {
    setDadosTratamento({identificacao: "", descricao: "", patologia: "", status: "", cid: "", profissionalResponsavel: "", dataInicio: "", dataFim: ""});
    setReceituariosVinculados([])
  };

  const onSubmit = () => {
    const newErrors = ValidaCampos(campos, dadosTratamento);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors); // Atualiza o estado de erros
      return; // Interrompe a execução
    }

    const _dadosTratamento = {
      ...dadosTratamento,
      pacienteId: pacienteId != null ? pacienteId : userAcesso?.pacienteId,
      receituarios: receituariosVinculados.map(m => {
        return {id: m.id}
      })
    }

    if (Object.keys(dadosEdicao).length == 0) {
      setLoading(true);
      api.post("/Tratamentos", _dadosTratamento)
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
      api.put("/Tratamentos/update", _dadosTratamento)
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

    // Estado local para manipular a lista
    const [receituariosVinculados, setReceituariosVinculados] = useState([]);

    // Preencher medicamentos vinculados ao editar
    useEffect(() => {
      if (dadosEdicao.receituarios && Array.isArray(dadosEdicao.receituarios)) {
        const receits = dadosEdicao.receituarios.map(m => (
          {
            id: m?.id,
            nome: `${m.medicamento?.identificacao} ${m.medicamento?.concentracao} ${m.medicamento?.unidade}, ${m.medicamento?.tipoMedicamento}, 
              ${m.frequencia} ${m.frequencia > 1 ? "vezes" : "vez"} por ${m.tempo.toLowerCase()} pela ${m.periodo.toLowerCase()}`
          }
        ));
        setReceituariosVinculados(receits);
      }
    }, [dadosEdicao]);

    const removerMedicamento = (id) => {
      setReceituariosVinculados(receituariosVinculados.filter(med => med.id !== id));
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
      <Row>
        <Input campos={addCampos} dados={dadosTratamento} handleChangeDados={handleDadosTratamentoChange} errors={errors} />
        <Col md="8">
            <Form.Group className="mb-3">
            <Form.Label>
                <span className="text-danger">*</span> Receituários
            </Form.Label>
            <Form.Select
                aria-label="Receituários"
                value={listaReceituariosPaciente}
                isInvalid={!!errors.status}
                onChange={handleAddReceituarioTratamento}
            >
                <option value={""}>Selecione</option>
                {listaReceituariosPaciente?.map((m, index) => (
                <option key={index} value={m.id}>{`${m.medicamento?.identificacao} ${m.medicamento?.concentracao} ${m.medicamento?.unidade}, ${m.medicamento?.tipoMedicamento}, 
                  ${m.frequencia} ${m.frequencia > 1 ? "vezes" : "vez"} por ${m.tempo.toLowerCase()} pela ${m.periodo.toLowerCase()}`}</option>
                ))}
            </Form.Select>
            </Form.Group>
        </Col>
      </Row>
      <Row className="mb-3">
  <Col>
    <Form.Label>Receituários</Form.Label>
    <InputWithButtons dados={receituariosVinculados} handleRemover={removerMedicamento} />
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
          {Object.keys(dadosTratamento).length > 0 && (
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

export default AddTratamentos;
