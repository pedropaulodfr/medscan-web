import { useState, useEffect } from "react";

// Bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import TabelaListagem from "../../components/TabelaListagem/TabelaListagem";
import Form from "react-bootstrap/Form";

// Utils e helpers
import Loading from "../../components/Loading/Loading";
import { showMessage, showQuestion } from "../../helpers/message";
import { useApi } from "../../api/useApi";
import AddPacientes from "./AddPacientes";
import moment from "moment";
import FichaPaciente from "./FichaPaciente";

export default function Pacientes() {
  const api = useApi();
  const [dadosPacientes, setDadosPacientes] = useState([]);
  const [_dadosPacientes, set_DadosPacientes] = useState([]);
  const [isFiltro, setIsFiltro] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addPaciente, setAddPaciente] = useState(false);
  const [editarPaciente, setEditarPaciente] = useState(false);
  const [dadosPacientesEditar, setDadosPacientesEditar] = useState([]);
  const [visualizarPaciente, setVisualizarPaciente] = useState(false);
  const [dadosPacientesVisualizar, setDadosPacientesVisualizar] = useState([]);
  const [atualizarTabela , setAtualizarTabela]  = useState(false);

  const headers = [
    { value: "Nome", objectValue: "nome" },
    { value: "Cpf", objectValue: "cpf" },
    { value: "Data Nascimento", objectValue: "dataNascimento" },
    { value: "Email", objectValue: "email" },
    { value: "Endereço", objectValue: "endereco" },
    { value: "Plano", objectValue: "planoSaude" },
    { value: "CNS", objectValue: "cns" },
  ];

  const handleDelete = (item) => {
    showQuestion("Tem certeza?", "Tem certeza que deseja excluir esse paciente? Esta ação é irreversível", "info",
      (confirmation) => {
        if (confirmation) {
          setLoading(true);
          api.delete("/Pacientes/delete", item.id).then((result) => {
            if (result.status !== 200) throw new Error("Houve um erro ao tentar excluir o paciente!");
              
            showMessage( "Sucesso", "Paciente excluído com sucesso!", "success", null);
            setLoading(false);
            setAtualizarTabela(true)
          })
          .catch((err) => {showMessage( "Erro", err, "error", null); setLoading(false)})
        }
      }
    );
  }
  
  const handleEditar = (item) => {    
    setDadosPacientesEditar(item)
    setEditarPaciente(true)
  }
  
  const handleVisualizar = (item) => { 
    setDadosPacientesVisualizar(item)
    setVisualizarPaciente(true)
  }
 
  // Ações da tabela
  const actions = [
    { icon: "bi bi-eye", color: "primary", action: handleVisualizar},
    { icon: "bi bi-pencil-square text-white", color: "warning", action: handleEditar},
    { icon: "bi bi-x-circle-fill text-white", color: "danger", action: handleDelete},
  ];

  // Filtros
  const [nomeFiltro, setNomeFiltro] = useState("");
  const [cpfFiltro, setCpfFiltro] = useState("");
  const [planoSaudeFiltro, setPlanoSaudeFiltro] = useState("");
  const [cnsFiltro, setCnsFiltro] = useState("");
  const [enderecoFiltro, setEnderecoFiltro] = useState("");

  const handleFiltroChange = (event, campo) => {
    if (campo == "nome") setNomeFiltro(event.target.value);
    if (campo == "cpf") setCpfFiltro(event.target.value);
    if (campo == "planoSaude") setPlanoSaudeFiltro(event.target.value);
    if (campo == "endereco") setEnderecoFiltro(event.target.value);
    if (campo == "cns") setCnsFiltro(event.target.value);
  };

  useEffect(() => {
    setAtualizarTabela(false)
    const fetchData = async () => {
      try {
        setLoading(true);
        await api.get("/Pacientes/getAll").then((result) => {
          result?.data?.map(m => {
            m.dataNascimento = moment(m.dataNascimento).format("DD/MM/YYYY")
          })
          
          setDadosPacientes(result.data);
          set_DadosPacientes(result.data);
          setLoading(false);
        });
      } catch (error) {
        showMessage("Aviso", "Erro ao buscar dados: " + error, "error", null);
        setLoading(false);
      }
    };

    fetchData();
  }, [addPaciente, setAddPaciente, atualizarTabela]);

  const handleFiltro = () => {
    // Resetar os dados para o estado original
    setDadosPacientes(dadosPacientes);

    // Verificar se algum filtro foi preenchido
    if (
      nomeFiltro === "" &&
      cpfFiltro === "" &&
      planoSaudeFiltro === "" &&
      cnsFiltro === "" &&
      enderecoFiltro === "" 
    ) {
      showMessage("Aviso", "Informe ao menos um dos campos!", "error", null);
      return;
    }

    // Criar uma cópia dos dados originais para aplicar os filtros
    let dadosFiltrados = [...dadosPacientes];

    if (nomeFiltro.trim() !== "") {
      dadosFiltrados = dadosFiltrados.filter((item) =>
        item.nome
          .toLowerCase()
          .includes(nomeFiltro.trim().toLowerCase())
      );
    }
    
    if (cpfFiltro.trim() !== "") {
      dadosFiltrados = dadosFiltrados.filter((item) =>
        item.cpf
          .toLowerCase()
          .includes(cpfFiltro.trim().toLowerCase())
      );
    }
    
    if (planoSaudeFiltro.trim() !== "") {
      dadosFiltrados = dadosFiltrados.filter((item) =>
        item.planoSaude
          ?.toLowerCase()
          .includes(planoSaudeFiltro.trim()?.toLowerCase())
      );
    }
    
    if (enderecoFiltro.trim() !== "") {
      dadosFiltrados = dadosFiltrados.filter((item) =>
        item.endereco
          .toLowerCase()
          .includes(enderecoFiltro.trim().toLowerCase())
      );
    }
    
    if (cnsFiltro.trim() !== "") {
      dadosFiltrados = dadosFiltrados.filter((item) =>
        item.cns
          ?.toLowerCase()
          .includes(cnsFiltro.trim()?.toLowerCase())
      );
    }

    setIsFiltro(true);
    setDadosPacientes(dadosFiltrados);
  };

  const handleaddPacientes = () => {
    setAddPaciente(true);
  };

  const handleLimparFiltro = () => {
    setNomeFiltro("");
    setCpfFiltro("");
    setEnderecoFiltro("");
    setPlanoSaudeFiltro("");
    setCnsFiltro("");
    setDadosPacientes(_dadosPacientes);
    setIsFiltro(false);
  };

  const handleReturn = () => {
    setAddPaciente(false)
    setEditarPaciente(false)
    setAtualizarTabela(true)
    setVisualizarPaciente(false)
  }

  return (
    <Container>
      {loading && <Loading />}
      <Row className="justify-content-md-center">
        <Col className="d-flex justify-content-center" >
          <h1 className="title-page">Pacientes</h1>
        </Col>
      </Row>
      {!addPaciente && !editarPaciente && !visualizarPaciente && (
        <>
          <Row>
            <Col md>
              <h4>Filtros</h4>
            </Col>
          </Row>
          <Form
            className="text-black mb-4 shadow p-3 mb-5 bg-white rounded"
            style={{
              borderRadius: "15px",
              padding: "20px",
            }}
          >
            <Row className="filtros">
              <Col md="3">
                <Form.Group className="mb-3">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    value={nomeFiltro}
                    onChange={(e) => handleFiltroChange(e, "nome")}
                  />
                </Form.Group>
              </Col>
              <Col md="3">
                <Form.Group className="mb-3">
                  <Form.Label>CPF</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    value={cpfFiltro}
                    onChange={(e) => handleFiltroChange(e, "cpf")}
                  />
                </Form.Group>
              </Col>
              <Col md="3">
                <Form.Group className="mb-3">
                  <Form.Label>Endereço</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    value={enderecoFiltro}
                    onChange={(e) => handleFiltroChange(e, "endereco")}
                  />
                </Form.Group>
              </Col>
              <Col md="3">
                <Form.Group className="mb-3">
                  <Form.Label>Plano de Saúde</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    value={planoSaudeFiltro}
                    onChange={(e) => handleFiltroChange(e, "planoSaude")}
                  />
                </Form.Group>
              </Col>
              <Col md="3">
                <Form.Group className="mb-3">
                  <Form.Label>CNS</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    value={cnsFiltro}
                    onChange={(e) => handleFiltroChange(e, "cns")}
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
                      style={{ backgroundColor: "#50BF84", borderColor: "#50BF84" }}
                      onClick={handleLimparFiltro}
                    >
                      <i className="bi bi-eraser"></i> Limpar Filtros
                    </Button>{" "}
                  </>
                )}
              </Col>
            </Row>
          </Form>
          {!addPaciente && !editarPaciente && (
            <Row>
              <Col>
                <Button
                  className="m-3 mb-0 mt-2 text-white"
                  variant="info"
                  style={{ backgroundColor: "#3F8576", borderColor: "#3F8576" }}
                  onClick={handleaddPacientes}
                >
                  <i className="bi bi-plus"></i> Cadastrar
                </Button>{" "}
              </Col>
            </Row>
          )}
          <Form
            className="text-black mb-4 shadow p-3 mb-5 bg-white rounded"
            style={{
              borderRadius: "15px",
              padding: "20px",
            }}
          >
            <Row className="justify-content-center">
              <Col>
                <TabelaListagem headers={headers} itens={dadosPacientes} actions={actions} />
              </Col>
            </Row>
          </Form>
        </>
      )}
      {addPaciente && (
        <Form className="text-black mb-4 shadow p-3 mb-5 bg-white rounded">
          <AddPacientes handleReturn={handleReturn} />
        </Form>
      )}
      {editarPaciente && (
        <Form className="text-black mb-4 shadow p-3 mb-5 bg-white rounded">
          <AddPacientes handleReturn={handleReturn} dadosEdicao={dadosPacientesEditar} />
        </Form>
      )}
      {visualizarPaciente && (
        <Form className="text-black mb-4 shadow p-3 mb-5 bg-white rounded">
          <FichaPaciente dados={dadosPacientesVisualizar} handleReturn={handleReturn} />
        </Form>
      )}
    </Container>
  );
}
