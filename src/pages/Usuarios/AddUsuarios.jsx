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
import { getSessionCookie } from "../../helpers/cookies";

const AddUsuarios = ({ handleReturn, dadosEdicao = [] }) => {
  const api = useApi();
  const [dadosUsuario, setdadosUsuario] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    identificacao: false,
  });
  
  // Estado dos campos
  const [nome, setNome] = useState(null);
  const [perfil, setPerfil] = useState("");
  const [email, setEmail] = useState("");
  const [codigoCadastro, setCodigoCadastro] = useState("");
  const [status, setStatus] = useState("");

  // Campos a serem validados
  const campos = [
    { nome: "nome", type: "text" },
    { nome: "perfil", type: "text" },
    { nome: "email", type: "text" },
    { nome: "ativo", type: "text" },
  ];

  // Perfis
  const perfis = ["Admin", "Paciente"]
  
  // Status
  const listaStatus = ["Ativo", "Inativo"]

  // Estado dos campos de senha
  const [novaSenha, setNovaSenha] = useState("")
  const [confirmarSenha, setConfirmarSenha] = useState("")

useEffect(() => {
    if (Object.keys(dadosEdicao).length > 0) {
        setNome(dadosEdicao.nome)
        setPerfil(dadosEdicao.perfil)
        setEmail(dadosEdicao.email)
        setCodigoCadastro(dadosEdicao.codigoCadastro)
        setStatus(dadosEdicao.ativo)

        setdadosUsuario({
            ...dadosUsuario,
            id: dadosEdicao.id,
            nome: dadosEdicao.nome,
            perfil: dadosEdicao.perfil,
            email: dadosEdicao.email,
            codigoCadastro: dadosEdicao.codigoCadastro,
            ativo: dadosEdicao.ativo
        });
    }
}, []);

  const handleNomeChange = (event) => {
    setNome(event.target.value);
    setdadosUsuario({
      ...dadosUsuario,
      nome: event.target.value,
    });
  };

  const handlePerfilChange = (event) => {
    setPerfil(event.target.value);
    setdadosUsuario({
      ...dadosUsuario,
      perfil: event.target.value,
    });
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setdadosUsuario({
      ...dadosUsuario,
      email: event.target.value,
    });
  };
  
  const handleCodigoCadastroChange = (event) => {
    setCodigoCadastro(event.target.value);
    setdadosUsuario({
      ...dadosUsuario,
      codigoCadastro: event.target.value,
    });
  };
  
  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    setdadosUsuario({
      ...dadosUsuario,
      ativo: event.target.value,
    });
  };
  
  const handleLimparCampos = () => {
    setNome("")
    setPerfil("")
    setEmail("")
    setCodigoCadastro("")
    setStatus("")
  };

  const onSubmit = () => {
    const newErrors = ValidaCampos(campos, dadosUsuario);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors); // Atualiza o estado de erros
      return; // Interrompe a execução
    }

    if (Object.keys(dadosEdicao).length == 0) {
      setLoading(true);
      api.post("/Usuarios/insert", dadosUsuario)
        .then((result) => {
          if (result.status !== 200)
            throw new Error(result?.response?.data?.message);

          showMessage("Sucesso", "Usuário cadastrado com sucesso!", "success", null);
          setLoading(false);
          handleLimparCampos();
        })
        .catch((err) => {
          showMessage("Erro", err, "error", null);
          setLoading(false);
        });
    } else {
      var objUsuario = dadosUsuario;
      if (dadosEdicao.perfil == "Admin" && novaSenha === confirmarSenha) {
        objUsuario = {
          ...dadosUsuario,
          senha: novaSenha
        }
      } else if (dadosEdicao.perfil == "Admin" && novaSenha != "" && confirmarSenha == "") {
        setErrors({confirmarSenha: true})
        return
      } else if (dadosEdicao.perfil == "Admin" && novaSenha == "" && confirmarSenha != "") {  
        setErrors({novaSenha: true})
        return
      } else if (dadosEdicao.perfil == "Admin" && novaSenha !== confirmarSenha) {
        setErrors({novaSenha: true, confirmarSenha: true})
        return
      }
      
      setLoading(true);
      api.put("/Usuarios/update", objUsuario)
        .then((result) => {
          if (result.status !== 200)
            throw new Error(result?.response?.data?.message);

          showMessage(
            "Sucesso",
            "Usuário editado com sucesso!",
            "success",
            () => {
              handleReturn();
            }
          );
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
          <Form.Group className="mb-3">
            <Form.Label><span className="text-danger">*</span> Nome</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nome"
              value={nome}
              onChange={(e) => handleNomeChange(e)}
              isInvalid={!!errors.nome}
            />
          </Form.Group>
        </Col>
        <Col md="4">
          <Form.Group className="mb-3">
            <Form.Label>
              <span className="text-danger">*</span> Perfil
            </Form.Label>
            <Form.Select
              aria-label="Default select example"
              value={perfil}
              onChange={(e) => handlePerfilChange(e)}
              isInvalid={!!errors.perfil}
            >
              <option value={0}>Selecione</option>
              {perfis?.map((m, index) => (
                <option key={index} value={m}>{m}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md="4">
          <Form.Group className="mb-3">
            <Form.Label><span className="text-danger">*</span> Email</Form.Label>
            <Form.Control
              type="text"
              placeholder="usuario@exemplo.com"
              value={email}
              onChange={(e) => handleEmailChange(e)}
              isInvalid={!!errors.email}
            />
          </Form.Group>
        </Col>
        
        <Col md="4">
          <Form.Group className="mb-3">
            <Form.Label>Código de Cadastro</Form.Label>
            <Form.Control
              type="text"
              placeholder="0000"
              value={codigoCadastro}
              onChange={(e) => handleCodigoCadastroChange(e)}
              isInvalid={!!errors.codigoCadastro}
              />
          </Form.Group>
        </Col>
        <Col md="4">
          <Form.Group className="mb-3">
            <Form.Label>
              <span className="text-danger">*</span> Status
            </Form.Label>
            <Form.Select
              aria-label="Default select example"
              value={status}
              onChange={(e) => handleStatusChange(e)}
              isInvalid={!!errors.ativo}
              >
              <option value={""}>Selecione</option>
              {listaStatus?.map((m, index) => (
                <option key={index} value={m}>{m}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        {getSessionCookie()?.perfil == "Admin" &&
        <Row>
        <hr className="text-black d-none d-sm-block m-2" />
        <span className="fw-bold mb-2">Senha de Acesso</span>
        <Col md="4">
            <Form.Group className="mb-3">
              <Form.Label><span className="text-danger">*</span> Nova Senha</Form.Label>
              <Form.Control
                type="password"
                placeholder="Nova Senha"
                autoComplete="off"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                isInvalid={!!errors.novaSenha}
              />
            </Form.Group>
          </Col>
          <Col md="4">
            <Form.Group className="mb-3">
              <Form.Label><span className="text-danger">*</span> Confirmar Senha</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirmar Senha"
                autoComplete="off"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                isInvalid={!!errors.confirmarSenha}
              />
            </Form.Group>
          </Col>
        </Row>
      }
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
          {Object.keys(dadosUsuario).length > 0 && (
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

export default AddUsuarios;
