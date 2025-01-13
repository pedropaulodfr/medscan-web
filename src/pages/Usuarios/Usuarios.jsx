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
import AddUsuarios from "./AddUsuarios";

export default function Usuarios() {
  const api = useApi();
  const [dadosUsuarios, setdadosUsuarios] = useState([]);
  const [_dadosUsuarios, set_dadosUsuarios] = useState([]);
  const [isFiltro, setIsFiltro] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addUsuario, setaddUsuario] = useState(false);
  const [editarUsuario, seteditarUsuario] = useState(false);
  const [dadosUsuariosEditar, setdadosUsuariosEditar] = useState([]);
  const [atualizarTabela , setAtualizarTabela]  = useState(false);

  const headers = [
    { value: "Nome", objectValue: "nome" },
    { value: "Perfil", objectValue: "perfil" },
    { value: "Email", objectValue: "email" },
    { value: "Codigo Cadastro", objectValue: "codigoCadastro" },
    { value: "Status", objectValue: "ativo" },
  ];

  const handleDelete = (item) => {
    showQuestion("Tem certeza?", "Tem certeza que deseja excluir esse usuário? Esta ação é irreversível", "info",
      (confirmation) => {
        if (confirmation) {
          setLoading(true);
          api.delete("/Usuarios/delete", item.id).then((result) => {
            if (result.status !== 200) throw new Error("Houve um erro ao tentar excluir o usuário!");
              
            showMessage( "Sucesso", "Usuário excluído com sucesso!", "success", null);
            setLoading(false);
            setAtualizarTabela(true)
          })
          .catch((err) => {showMessage( "Erro", err, "error", null); setLoading(false)})
        }
      }
    );
  }
  
  const handleEditar = (item) => {    
    setdadosUsuariosEditar(item)
    seteditarUsuario(true)
  }
 
  // Ações da tabela
  const actions = [
    { icon: "bi bi-pencil-square text-white", color: "warning", action: handleEditar},
    { icon: "bi bi-x-circle-fill text-white", color: "danger", action: handleDelete},
  ];

  // Filtros
  const [UsuarioFiltro, setUsuarioFiltro] = useState("");

  const handleMedicamentoChange = (event) => {
    setUsuarioFiltro(event.target.value);
  };

  useEffect(() => {
    setAtualizarTabela(false)
    const fetchData = async () => {
      try {
        setLoading(true);
        await api.get("/Usuarios/getAll").then((result) => {
          setdadosUsuarios(result.data);
          set_dadosUsuarios(result.data);
          setLoading(false);
        });
      } catch (error) {
        showMessage("Aviso", "Erro ao buscar dados: " + error, "error", null);
        setLoading(false);
      }
    };

    fetchData();
  }, [addUsuario, setaddUsuario, atualizarTabela]);

  const handleFiltro = () => {
    // Resetar os dados para o estado original
    setdadosUsuarios(dadosUsuarios);

    // Verificar se algum filtro foi preenchido
    if (
      UsuarioFiltro === ""
    ) {
      showMessage("Aviso", "Informe ao menos um dos campos!", "error", null);
      return;
    }

    // Criar uma cópia dos dados originais para aplicar os filtros
    let dadosFiltrados = [...dadosUsuarios];

    if (UsuarioFiltro.trim() !== "") {
      dadosFiltrados = dadosFiltrados.filter((item) =>
        item.nome
          .toLowerCase()
          .includes(UsuarioFiltro.trim().toLowerCase())
      );
    }

    setIsFiltro(true);
    setdadosUsuarios(dadosFiltrados);
  };

  const handleaddUsuarios = () => {
    setaddUsuario(true);
  };

  const handleLimparFiltro = () => {
    setUsuarioFiltro("");
    setdadosUsuarios(_dadosUsuarios);
    setIsFiltro(false);
  };

  const handleReturn = () => {
    setaddUsuario(false)
    seteditarUsuario(false)
    setAtualizarTabela(true)
  }

  return (
    <Container>
      {loading && <Loading />}
      <Row className="justify-content-md-center">
        <Col className="d-flex justify-content-center" >
          <h1 className="title-page">Usuários</h1>
        </Col>
      </Row>
      {!addUsuario && !editarUsuario && (
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
                    value={UsuarioFiltro}
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
          {!addUsuario && !editarUsuario && (
            <Row>
              <Col>
                <Button
                  className="m-3 mb-0 mt-2 text-white"
                  variant="info"
                  style={{ backgroundColor: "#3F8576", borderColor: "#3F8576" }}
                  onClick={handleaddUsuarios}
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
                <TabelaListagem headers={headers} itens={dadosUsuarios} actions={actions} />
              </Col>
            </Row>
          </Form>
        </>
      )}
      {addUsuario && (
        <Form className="text-black mb-4 shadow p-3 mb-5 bg-white rounded">
          <AddUsuarios handleReturn={handleReturn} />
        </Form>
      )}
      {editarUsuario && (
        <Form className="text-black mb-4 shadow p-3 mb-5 bg-white rounded">
          <AddUsuarios handleReturn={handleReturn} dadosEdicao={dadosUsuariosEditar} />
        </Form>
      )}
    </Container>
  );
}
