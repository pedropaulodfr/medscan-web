import { useState, useEffect } from "react";

// Bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

// Utils e helpers
import Loading from "../../../components/Loading/Loading";
import TabelaListagem from "../../../components/TabelaListagem/TabelaListagem";
import { showMessage, showQuestion } from "../../../helpers/message";
import { useApi } from "../../../api/useApi";
import AddUnidades from "./AddUnidades";

export default function Unidades() {
  const api = useApi();
  const [dadosUnidades, setDadosUnidades] = useState([]);
  const [_dadosUnidades, set_DadosUnidades] = useState([]);
  const [isFiltro, setIsFiltro] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addUnidades, setAddUnidades] = useState(false);
  const [editarUnidade, setEditarUnidade] = useState(false);
  const [dadosUnidadeEditar, setDadosUnidadeEditar] = useState([]);
  const [atualizarTabela , setAtualizarTabela]  = useState(false);

  const headers = [
    { value: "Unidade", objectValue: "identificacao" },
    { value: "Descrição", objectValue: "descricao" },
  ];

  const handleDelete = (item) => {
    showQuestion("Tem certeza?", "Tem certeza que deseja excluir o registro? Esta ação é irreversível", "info",
      (confirmation) => {
        if (confirmation) {
          setLoading(true);
          api.delete("/Unidades/delete", item.id).then((result) => {
            if (result.status !== 200) throw new Error("Houve um erro ao tentar deletar a unidade!");
              
            showMessage( "Sucesso", "Unidade deletada com sucesso!", "success", null);
            setLoading(false);
            setAtualizarTabela(true)
          })
          .catch((err) => {showMessage( "Erro", err, "error", null); setLoading(false)})
        }
      }
    );
  }
  
  const handleEditar = (item) => {
    setDadosUnidadeEditar(item)
    setEditarUnidade(true)
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
        api.get("/Unidades/getAll").then((result) => {
          result.data.map((m) => {
            m.concentracao = `${m.concentracao} ${m.unidade}`;
          });

          setDadosUnidades(result.data);
          set_DadosUnidades(result.data);
          setLoading(false);
        });
      } catch (error) {
        showMessage("Aviso", "Erro ao buscar dados: " + error, "error", null);
        setLoading(false);
      }
    };

    fetchData();
  }, [addUnidades, setAddUnidades, atualizarTabela]);

  const handleFiltro = () => {
    // Resetar os dados para o estado original
    setDadosUnidades(dadosUnidades);

    // Verificar se algum filtro foi preenchido
    if (unidadeFiltro === "") {
      showMessage("Aviso", "Informe ao menos um dos campos!", "error", null);
      return;
    }

    // Criar uma cópia dos dados originais para aplicar os filtros
    let dadosFiltrados = [...dadosUnidades];

    if (unidadeFiltro.trim() !== "") {
      dadosFiltrados = dadosFiltrados.filter((item) =>
        item.identificacao
          .toLowerCase()
          .includes(unidadeFiltro.trim().toLowerCase())
      );
      dadosFiltrados.sort((a, b) => {
        return a.identificacao - b.identificacao;
      });
    }

    setIsFiltro(true);
    setDadosUnidades(dadosFiltrados);
  };

  const handleLimparFiltro = () => {
    setUnidadeFiltro("");
    setDadosUnidades(_dadosUnidades);
    setIsFiltro(false);
  };

  const handleAddUnidades = () => {
    setAddUnidades(true);
  };

  const handleReturn = () => {
    setAddUnidades(false)
    setEditarUnidade(false)
    setAtualizarTabela(true)
  }

  return (
    <Container>
      {loading && <Loading />}
      <Row className="justify-content-md-center">
        <Col className="d-flex justify-content-center">
          <h1 className="title-page">Unidades</h1>
        </Col>
      </Row>
      {!addUnidades && !editarUnidade && (
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
                  <Form.Label>Unidade</Form.Label>
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
          {!addUnidades && !editarUnidade && (
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
                <TabelaListagem headers={headers} itens={dadosUnidades} actions={actions} />
              </Col>
            </Row>
          </Form>
        </>
      )}
      {addUnidades && (
        <Form className="text-black mb-4 shadow p-3 mb-5 bg-white rounded">
          <AddUnidades handleReturn={handleReturn} />
        </Form>
      )}
      {editarUnidade && (
        <Form className="text-black mb-4 shadow p-3 mb-5 bg-white rounded">
          <AddUnidades handleReturn={handleReturn} dadosEdicao={dadosUnidadeEditar} />
        </Form>
      )}
    </Container>
  );
}
