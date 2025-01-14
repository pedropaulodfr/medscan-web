import { useState, useEffect } from "react";
import moment from "moment";

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
import AddCartaoControle from "./AddCartaoControle.jsx";
import { getSessionCookie } from "../../helpers/cookies.js";

export default function CartaoControle() {
  const api = useApi();
  const [dadosCartaoControle, setdadosCartaoControle] = useState([]);
  const [_dadosCartaoControle, set_dadosCartaoControle] = useState([]);
  const [isFiltro, setIsFiltro] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addRegistro, setAddRegistro] = useState(false);
  const [editarRegistro, setEditarRegistro] = useState(false);
  const [dadosRegistroEditar, setDadosRegistroEditar] = useState([]);
  const [atualizarTabela , setAtualizarTabela]  = useState(false);

  const headers = [
    { value: "Data", objectValue: "data" },
    { value: "Medicamento", objectValue: "medicamentoFormatado" },
    { value: "Quantidade", objectValue: "quantidadeFormatada" },
    { value: "Retorno", objectValue: "dataRetorno" },
    { value: "Profissional", objectValue: "profissional" },
  ];

  const handleDelete = (item) => {
    showQuestion("Tem certeza?", "Tem certeza que deseja excluir o registro?\n Esta ação é irreversível", "info",
      (confirmation) => {
        if (confirmation) {
          setLoading(true);
          api.delete("/CartaoControle/delete", item.id).then((result) => {
            if (result.status !== 200) throw new Error("Houve um erro ao tentar excluir o registro!");
              
            showMessage( "Sucesso", "Registro excluído com sucesso!", "success", null);
            setLoading(false);
            setAtualizarTabela(true)
          })
          .catch((err) => {showMessage( "Erro", err, "error", null); setLoading(false)})
        }
      }
    );
  }
  
  const handleEditar = (item) => {
    setDadosRegistroEditar(item)
    setEditarRegistro(true)
  }
 
  // Ações da tabela
  const actions = [
    { icon: "bi bi-pencil-square text-white", color: "warning", action: handleEditar},
    { icon: "bi bi-x-circle-fill text-white", color: "danger", action: handleDelete},
  ];

  // Filtros
  const [medicamentoFiltro, setMedicamentoFiltro] = useState("");
  const [profissionalFiltro, setProfissionalFiltro] = useState("");
  const [dataInicialFiltro, setDataInicialFiltro] = useState("");
  const [dataFinalFiltro, setDataFinalFiltro] = useState("");

  const handleMedicamentoChange = (event) => {
    setMedicamentoFiltro(event.target.value);
  };

  const handleProfissionalChange = (event) => {
    setProfissionalFiltro(event.target.value);
  };

  const handleDataInicialChange = (event) => {
    setDataInicialFiltro(event.target.value);
  };

  const handleDataFinalChange = (event) => {
    setDataFinalFiltro(event.target.value);
  };

  useEffect(() => {
    setAtualizarTabela(false)
    const fetchData = async () => {
      try {
        setLoading(true);
        api.get(`/CartaoControle/get/${getSessionCookie()?.pacienteId}`).then((result) => {
          result?.data?.map(m => {
            m.data = moment(m.data).format("DD/MM/YYYY")
            m.dataRetorno = moment(m.dataRetorno).format("DD/MM/YYYY")
            m.medicamentoFormatado = `${m.medicamento} ${m.concentracao} ${m.unidade}`
            m.quantidadeFormatada = `${m.quantidade} ${m.tipo}`
          })
          setdadosCartaoControle(result.data);
          set_dadosCartaoControle(result.data);
          setLoading(false);
        });
      } catch (error) {
        showMessage("Aviso", "Erro ao buscar dados: " + error, "error", null);
        setLoading(false);
      }
    };

    fetchData();
  }, [addRegistro, setAddRegistro, atualizarTabela]);

  const handleFiltro = () => {
    // Resetar os dados para o estado original
    setdadosCartaoControle(dadosCartaoControle);

    // Verificar se algum filtro foi preenchido
    if (
      medicamentoFiltro === "" &&
      profissionalFiltro === "" &&
      dataInicialFiltro === "" &&
      dataFinalFiltro === ""
    ) {
      showMessage("Aviso", "Informe ao menos um dos campos!", "error", null);
      return;
    }

    // Criar uma cópia dos dados originais para aplicar os filtros
    let dadosFiltrados = [...dadosCartaoControle];

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

    if (profissionalFiltro.trim() !== "") {
      dadosFiltrados = dadosFiltrados.filter((item) =>
        item.profissional
          .toLowerCase()
          .includes(profissionalFiltro.trim().toLowerCase())
      );
      dadosFiltrados.sort((a, b) => {
        return a.profissional - b.profissional;
      });
    }

    if (dataInicialFiltro.trim() !== "") {
      const dataInicial = new Date(dataInicialFiltro);
      dadosFiltrados = dadosFiltrados.filter(
        (item) =>
          moment(item.data, "DD/MM/YYYY") >= moment(dataInicial, "YYYY-MM-DD")
      );
      dadosFiltrados.sort((a, b) => {
        return moment(a.data, "DD/MM/YYYY") - moment(b.data, "DD/MM/YYYY");
      });
    }

    if (dataFinalFiltro.trim() !== "") {
      const dataFinal = new Date(dataFinalFiltro);
      dadosFiltrados = dadosFiltrados.filter(
        (item) =>
          moment(item.data, "DD/MM/YYYY") < moment(dataFinal, "YYYY-MM-DD")
      );
      dadosFiltrados.sort((a, b) => {
        return moment(a.data, "DD/MM/YYYY") - moment(b.data, "DD/MM/YYYY");
      });
    }

    setIsFiltro(true);
    setdadosCartaoControle(dadosFiltrados);
  };

  const handleAddRegistros = () => {
    setAddRegistro(true);
  };

  const handleLimparFiltro = () => {
    setMedicamentoFiltro("");
    setProfissionalFiltro("");
    setDataInicialFiltro("");
    setDataFinalFiltro("");
    setdadosCartaoControle(_dadosCartaoControle);
    setIsFiltro(false);
  };

  const handleReturn = () => {
    setAddRegistro(false)
    setEditarRegistro(false)
    setAtualizarTabela(true)
  }

  return (
    <Container>
      {loading && <Loading />}
      <Row className="justify-content-md-center">
        <Col className="d-flex justify-content-center" >
          <h1 className="title-page">Cartão de Controle</h1>
        </Col>
      </Row>
      {!addRegistro && !editarRegistro && (
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
              <Col md>
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
              <Col md>
                <Form.Group className="mb-3">
                  <Form.Label>Profissional</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    value={profissionalFiltro}
                    onChange={(e) => {handleProfissionalChange(e)}}
                  />
                </Form.Group>
              </Col>
              <Col md>
                <Form.Group controlId="date" bsSize="large">
                  <Form.Label>Data Inicial</Form.Label>
                  <Form.Control
                    type="date"
                    style={{ width: "100%" }}
                    value={dataInicialFiltro}
                    onChange={(e) => {
                      handleDataInicialChange(e);
                    }}
                  />
                </Form.Group>
              </Col>
              <Col md>
                <Form.Group controlId="date" bsSize="large">
                  <Form.Label>Data Final</Form.Label>
                  <Form.Control
                    type="date"
                    style={{ width: "100%" }}
                    value={dataFinalFiltro}
                    onChange={(e) => {
                      handleDataFinalChange(e);
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col className="d-flex justify-content-center" xs={11}>
                <Button
                  className="mb-0 mt-0 text-white"
                  variant="info"
                  style={{ backgroundColor: "#3F8576", borderColor: "#3F8576" }}

                  onClick={handleFiltro}
                  >
                  <i className="bi bi-funnel"></i> Filtrar
                </Button>{" "}
                {isFiltro && (
                  <>
                    <Button
                      className="m-3 mb-0 mt-0 text-white"
                      variant="info"
                      style={{ backgroundColor: "#50BF84", borderColor: "#50BF84" }}

                      onClick={handleLimparFiltro}
                    >
                      <i className="bi bi-eraser"></i> Limpar Filtros
                    </Button>{" "}
                  </>
                )}
              </Col>
              <Col></Col>
              <Col></Col>
            </Row>
          </Form>
          {!addRegistro && !editarRegistro && (
            <Row>
              <Col>
                <Button
                  className="m-3 mb-0 mt-2 text-white"
                  variant="info"
                  style={{ backgroundColor: "#3F8576", borderColor: "#3F8576" }}
                  onClick={handleAddRegistros}
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
                <TabelaListagem headers={headers} itens={dadosCartaoControle} actions={actions} />
              </Col>
            </Row>
          </Form>
        </>
      )}
      {addRegistro && (
        <Form className="text-black mb-4 shadow p-3 mb-5 bg-white rounded">
          <AddCartaoControle handleReturn={handleReturn} />
        </Form>
      )}
      {editarRegistro && (
        <Form className="text-black mb-4 shadow p-3 mb-5 bg-white rounded">
          <AddCartaoControle handleReturn={handleReturn} dadosEdicao={dadosRegistroEditar} />
        </Form>
      )}
    </Container>
  );
}
