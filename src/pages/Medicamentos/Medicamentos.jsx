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
import AddMedicamentos from "./AddMedicamentos";
import { useApi } from "../../api/useApi";

export default function Medicamentos() {
  const api = useApi();
  const [dadosMedicamentos, setDadosMedicamentos] = useState([]);
  const [_dadosMedicamentos, set_DadosMedicamentos] = useState([]);
  const [isFiltro, setIsFiltro] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addMedicamentos, setAddMedicamentos] = useState(false);
  const [editarMedicamento, setEditarMedicamento] = useState(false);
  const [dadosMedicamentoEditar, setDadosMedicamentoEditar] = useState([]);
  const [atualizarTabela , setAtualizarTabela]  = useState(false);

  const headers = [
    { value: "Medicamento", objectValue: "identificacao" },
    { value: "Concentração", objectValue: "concentracaoUnidade" },
    { value: "Descrição", objectValue: "descricao" },
    { value: "Tipo", objectValue: "tipoMedicamento" },
    { value: "Status", objectValue: "status" },
  ];

  const handleDelete = (item) => {
    showQuestion("Tem certeza?", "Tem certeza que deseja excluir o registro? Esta ação é irreversível", "info",
      (confirmation) => {
        if (confirmation) {
          setLoading(true);
          api.delete("/Medicamentos/delete", item.id).then((result) => {
            if (result.status !== 200) throw new Error(result?.response?.data?.message);
              
            showMessage( "Sucesso", "Medicamento deletado com sucesso!", "success", null);
            setLoading(false);
            setAtualizarTabela(true)
          })
          .catch((err) => {showMessage( "Erro", err, "error", null); setLoading(false)})
        }
      }
    );
  }
  
  const handleEditar = (item) => {
    setDadosMedicamentoEditar(item)
    setEditarMedicamento(true)
  }

  // Açõeas da tabela
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
        api.get("/Medicamentos/getAll").then((result) => {
          result.data.map((m) => {
            m.concentracaoUnidade = `${m.concentracao} ${m.unidade}`;
          });

          const dadosOrdenados = result.data.sort((a, b) => a.identificacao.localeCompare(b.identificacao));
          setDadosMedicamentos(dadosOrdenados);
          set_DadosMedicamentos(dadosOrdenados);
          setLoading(false);
        });
      } catch (error) {
        showMessage("Aviso", "Erro ao buscar dados: " + error, "error", null);
        setLoading(false);
      }
    };

    fetchData();
  }, [addMedicamentos, setAddMedicamentos, atualizarTabela]);

  const handleFiltro = () => {
    // Resetar os dados para o estado original
    setDadosMedicamentos(dadosMedicamentos);

    // Verificar se algum filtro foi preenchido
    if (medicamentoFiltro === "") {
      showMessage("Aviso", "Informe ao menos um dos campos!", "error", null);
      return;
    }

    // Criar uma cópia dos dados originais para aplicar os filtros
    let dadosFiltrados = [...dadosMedicamentos];

    if (medicamentoFiltro.trim() !== "") {
      dadosFiltrados = dadosFiltrados.filter((item) =>
        item.identificacao
          .toLowerCase()
          .includes(medicamentoFiltro.trim().toLowerCase())
      );
    }

    setIsFiltro(true);
    setDadosMedicamentos(dadosFiltrados);
  };

  const handleLimparFiltro = () => {
    setMedicamentoFiltro("");
    setDadosMedicamentos(_dadosMedicamentos);
    setIsFiltro(false);
  };

  const handleAddMedicamentos = () => {
    setAddMedicamentos(true);
  };

  const handleReturn = () => {
    setAddMedicamentos(false)
    setEditarMedicamento(false)
    setAtualizarTabela(true)
  }

  return (
    <Container>
      {loading && <Loading />}
      <Row className="justify-content-md-center">
        <Col className="d-flex justify-content-center">
          <h1 className="title-page">Medicamentos</h1>
        </Col>
      </Row>
      {!addMedicamentos && !editarMedicamento && (
        <>
          <Row>
            <Col md>
              <h4>Filtros</h4>
            </Col>
          </Row>
          <Form className="text-black mb-4 shadow p-3 mb-5 bg-white rounded">
            <Row className="filtros">
              <Col md="3">
                <Form.Group className="mb-3">
                  <Form.Label>Medicamento</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    value={medicamentoFiltro}
                    onChange={(e) => {handleMedicamentoChange(e)}}
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
                      style={{backgroundColor: "#50BF84", borderColor: "#50BF84",}}
                      onClick={handleLimparFiltro}
                    >
                      <i className="bi bi-eraser"></i> Limpar Filtros
                    </Button>{" "}
                  </>
                )}
              </Col>
            </Row>
            <Row>
            </Row>
          </Form>
          {!addMedicamentos && !editarMedicamento && (
            <Row>
              <Col>
                <Button
                  className="m-3 mb-0 mt-2 text-white"
                  variant="info"
                  style={{ backgroundColor: "#3F8576", borderColor: "#3F8576" }}
                  onClick={handleAddMedicamentos}
                >
                  <i className="bi bi-plus"></i> Cadastrar
                </Button>{" "}
              </Col>
            </Row>
          )}
          <Form className="text-black mb-4 shadow p-3 mb-5 bg-white rounded">
            <Row className="justify-content-center">
              <Col>
                <TabelaListagem headers={headers} itens={dadosMedicamentos} actions={actions} />
              </Col>
            </Row>
          </Form>
        </>
      )}
      {addMedicamentos && (
        <Form className="text-black mb-4 shadow p-3 mb-5 bg-white rounded">
          <AddMedicamentos handleReturn={handleReturn} />
        </Form>
      )}
      {editarMedicamento && (
        <Form className="text-black mb-4 shadow p-3 mb-5 bg-white rounded">
          <AddMedicamentos handleReturn={handleReturn} dadosEdicao={dadosMedicamentoEditar} />
        </Form>
      )}
    </Container>
  );
}
