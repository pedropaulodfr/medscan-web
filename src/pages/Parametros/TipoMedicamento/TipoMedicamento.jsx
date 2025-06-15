import { useState, useEffect } from "react";

// Bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

// Utils e helpers
import TabelaListagem from "../../../components/TabelaListagem/TabelaListagem";
import { showMessage, showQuestion } from "../../../helpers/message";
import { useApi } from "../../../api/useApi";
import Loading from "../../../components/Loading/Loading";
import AddTipoMedicamento from "./AddTipoMedicamento";

export default function TipoMedicamento() {
  const api = useApi();
  const [dadosTipos, setDadosTipos] = useState([]);
  const [_dadosTipos, set_DadosTipos] = useState([]);
  const [isFiltro, setIsFiltro] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addTipos, setAddTipos] = useState(false);
  const [editarTipo, setEditarTipo] = useState(false);
  const [dadosUnidadeEditar, setDadosTipoEditar] = useState([]);
  const [atualizarTabela , setAtualizarTabela]  = useState(false);

  const headers = [
    { value: "Tipo", objectValue: "identificacao" },
    { value: "Descrição", objectValue: "descricao" },
  ];

  const handleDelete = (item) => {
    showQuestion("Tem certeza?", "Tem certeza que deseja excluir o registro? Esta ação é irreversível", "info",
      (confirmation) => {
        if (confirmation) {
          setLoading(true);
          api.delete("/TipoMedicamentos/delete", item.id).then((result) => {
            if (result.status !== 200) throw new Error("Houve um erro ao tentar deletar o tipo de medicamento!");
              
            showMessage( "Sucesso", "Tipo de medicamento deletado com sucesso!", "success", null);
            setLoading(false);
            setAtualizarTabela(true)
          })
          .catch((err) => {showMessage( "Erro", err, "error", null); setLoading(false)})
        }
      }
    );
  }
  
  const handleEditar = (item) => {
    setDadosTipoEditar(item)
    setEditarTipo(true)
  }
 
  const actions = [
    { icon: "bi bi-pencil-square text-white", color: "warning", action: handleEditar},
    { icon: "bi bi-x-circle-fill text-white", color: "danger", action: handleDelete},
  ];

  // Filtros
  const [unidadeFiltro, setUnidadeFiltro] = useState("");

  const handleUnidadeChange = (event) => {
    setUnidadeFiltro(event.target.value);
  };

  useEffect(() => {
    setAtualizarTabela(false)
    const fetchData = async () => {
      try {
        setLoading(true);
        api.get("/TipoMedicamentos/getAll").then((result) => {
          setDadosTipos(result.data);
          set_DadosTipos(result.data);
          setLoading(false);
        });
      } catch (error) {
        showMessage("Aviso", "Erro ao buscar dados: " + error, "error", null);
        setLoading(false);
      }
    };

    fetchData();
  }, [addTipos, setAddTipos, atualizarTabela]);

  const handleFiltro = () => {
    // Resetar os dados para o estado original
    setDadosTipos(dadosTipos);

    // Verificar se algum filtro foi preenchido
    if (unidadeFiltro === "") {
      showMessage("Aviso", "Informe ao menos um dos campos!", "error", null);
      return;
    }

    // Criar uma cópia dos dados originais para aplicar os filtros
    let dadosFiltrados = [...dadosTipos];

    if (unidadeFiltro.trim() !== "") {
      dadosFiltrados = dadosFiltrados.filter((item) =>
        item.identificacao
          .toLowerCase()
          .includes(unidadeFiltro.trim().toLowerCase())
      );
      dadosFiltrados?.sort((a, b) => {
        return a.identificacao - b.identificacao;
      });
    }

    setIsFiltro(true);
    setDadosTipos(dadosFiltrados);
  };

  const handleLimparFiltro = () => {
    setUnidadeFiltro("");
    setDadosTipos(_dadosTipos);
    setIsFiltro(false);
  };

  const handleAddUnidades = () => {
    setAddTipos(true);
  };

  const handleReturn = () => {
    setAddTipos(false)
    setEditarTipo(false)
    setAtualizarTabela(true)
  }

  return (
    <Container>
      {loading && <Loading />}
      <Row className="justify-content-md-center">
        <Col className="d-flex justify-content-center">
          <h1 className="title-page">Tipo Medicamento</h1>
        </Col>
      </Row>
      {!addTipos && !editarTipo && (
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
                  <Form.Label>Tipo</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    value={unidadeFiltro}
                    onChange={(e) => {handleUnidadeChange(e)}}
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
          {!addTipos && !editarTipo && (
            <Row>
              <Col>
                <Button
                  className="m-3 mb-0 mt-2 text-white"
                  variant="info"
                  style={{ backgroundColor: "#3F8576", borderColor: "#3F8576" }}
                  onClick={handleAddUnidades}
                >
                  <i className="bi bi-plus"></i> Cadastrar
                </Button>{" "}
              </Col>
            </Row>
          )}
          <Form className="text-black mb-4 shadow p-3 mb-5 bg-white rounded">
            <Row className="justify-content-center">
              <Col>
                <TabelaListagem headers={headers} itens={dadosTipos} actions={actions} />
              </Col>
            </Row>
          </Form>
        </>
      )}
      {addTipos && (
        <Form className="text-black mb-4 shadow p-3 mb-5 bg-white rounded">
          <AddTipoMedicamento handleReturn={handleReturn} />
        </Form>
      )}
      {editarTipo && (
        <Form className="text-black mb-4 shadow p-3 mb-5 bg-white rounded">
          <AddTipoMedicamento handleReturn={handleReturn} dadosEdicao={dadosUnidadeEditar} />
        </Form>
      )}
    </Container>
  );
}
