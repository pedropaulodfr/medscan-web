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
import AddReceituarios from "./AddReceituario";
import { getSessionCookie } from "../../helpers/cookies";

export default function Receituario() {
  const api = useApi();
  const [dadosReceituario, setDadosReceituario] = useState([]);
  const [_dadosReceituario, set_DadosReceituario] = useState([]);
  const [isFiltro, setIsFiltro] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addReceituario, setAddReceituario] = useState(false);
  const [editarReceituario, setEditarReceituario] = useState(false);
  const [dadosReceituarioEditar, setDadosReceituarioEditar] = useState([]);
  const [atualizarTabela , setAtualizarTabela]  = useState(false);

  const headers = [
    { value: "Medicamento", objectValue: "medicamentoFormatado" },
    { value: "Dose", objectValue: "doseFormatada" },
    { value: "Frequência", objectValue: "frequenciaFormatada" },
  ];

  const handleDelete = (item) => {
    showQuestion("Tem certeza?", "Tem certeza que deseja excluir o registro? Esta ação é irreversível", "info",
      (confirmation) => {
        if (confirmation) {
          setLoading(true);
          api.delete("/Receituario/delete", item.id).then((result) => {
            if (result.status !== 200) throw new Error("Houve um erro ao tentar excluir o receituário!");
              
            showMessage( "Sucesso", "Receiturário excluído com sucesso!", "success", null);
            setLoading(false);
            setAtualizarTabela(true)
          })
          .catch((err) => {showMessage( "Erro", err, "error", null); setLoading(false)})
        }
      }
    );
  }
  
  const handleEditar = (item) => {    
    setDadosReceituarioEditar(item)
    setEditarReceituario(true)
  }
 
  // Ações da tabela
  const actions = [
    { icon: "bi bi-pencil-square text-white", color: "warning", action: handleEditar},
    { icon: "bi bi-x-circle-fill text-white", color: "danger", action: handleDelete},
  ];

  // Filtros
  const [medicamentoFiltro, setMedicamentoFiltro] = useState("");

  const handleMedicamentoChange = (event) => {
    setMedicamentoFiltro(event.target.value);
  };

  useEffect(() => {
    setAtualizarTabela(false)
    const fetchData = async () => {
      try {
        setLoading(true);
        await api.get(`/Receituario/get/${getSessionCookie()?.pacienteId}`).then((result) => {
          result.data.map(m => {
            m.medicamentoFormatado = `${m.medicamento.identificacao} ${m.medicamento.concentracao} ${m.medicamento.unidade}`;
            m.doseFormatada = `${m.dose} ${m.medicamento.tipoMedicamento}`;
            m.frequenciaFormatada = `${m.frequencia} ${m.frequencia > 1 ? "vezes" : "vez"} por ${m.tempo.toLowerCase()} pela ${m.periodo.toLowerCase()}`;
          })
          
          setDadosReceituario(result.data);
          set_DadosReceituario(result.data);
          setLoading(false);
        });
      } catch (error) {
        showMessage("Aviso", "Erro ao buscar dados: " + error, "error", null);
        setLoading(false);
      }
    };

    fetchData();
  }, [addReceituario, setAddReceituario, atualizarTabela]);

  const handleFiltro = () => {
    // Resetar os dados para o estado original
    setDadosReceituario(dadosReceituario);

    // Verificar se algum filtro foi preenchido
    if (
      medicamentoFiltro === ""
    ) {
      showMessage("Aviso", "Informe ao menos um dos campos!", "error", null);
      return;
    }

    // Criar uma cópia dos dados originais para aplicar os filtros
    let dadosFiltrados = [...dadosReceituario];

    if (medicamentoFiltro.trim() !== "") {
      dadosFiltrados = dadosFiltrados.filter((item) =>
        item.medicamento
          .toLowerCase()
          .includes(medicamentoFiltro.trim().toLowerCase())
      );
      dadosFiltrados.sort((a, b) => {
        return a.medicamento - b.medicamento;
      });
    }

    setIsFiltro(true);
    setDadosReceituario(dadosFiltrados);
  };

  const handleAddReceituarios = () => {
    setAddReceituario(true);
  };

  const handleLimparFiltro = () => {
    setMedicamentoFiltro("");
    setDadosReceituario(_dadosReceituario);
    setIsFiltro(false);
  };

  const handleReturn = () => {
    setAddReceituario(false)
    setEditarReceituario(false)
    setAtualizarTabela(true)
  }

  return (
    <Container>
      {loading && <Loading />}
      <Row className="justify-content-md-center">
        <Col className="d-flex justify-content-center" >
          <h1 className="title-page">Receituário</h1>
        </Col>
      </Row>
      {!addReceituario && !editarReceituario && (
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
                  <Form.Label>Medicamento</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    value={medicamentoFiltro}
                    onChange={(e) => {
                      handleMedicamentoChange(e);
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
          {!addReceituario && !editarReceituario && (
            <Row>
              <Col>
                <Button
                  className="m-3 mb-0 mt-2 text-white"
                  variant="info"
                  style={{ backgroundColor: "#3F8576", borderColor: "#3F8576" }}
                  onClick={handleAddReceituarios}
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
                <TabelaListagem headers={headers} itens={dadosReceituario} actions={actions} />
              </Col>
            </Row>
          </Form>
        </>
      )}
      {addReceituario && (
        <Form className="text-black mb-4 shadow p-3 mb-5 bg-white rounded">
          <AddReceituarios handleReturn={handleReturn} />
        </Form>
      )}
      {editarReceituario && (
        <Form className="text-black mb-4 shadow p-3 mb-5 bg-white rounded">
          <AddReceituarios handleReturn={handleReturn} dadosEdicao={dadosReceituarioEditar} />
        </Form>
      )}
    </Container>
  );
}
