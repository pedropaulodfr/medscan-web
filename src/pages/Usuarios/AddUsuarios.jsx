import { useState, useEffect, useContext } from "react";

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
import AuthContext from "../../contexts/Auth/AuthContext"; // Importe o AuthContext


const AddUsuarios = ({ handleReturn, dadosEdicao = [] }) => {
  const api = useApi();
  const [dadosUsuario, setdadosUsuario] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { userAcesso } = useContext(AuthContext); 

  // Campos a serem validados
  const campos = [
    { nome: "nome", type: "text" },
    { nome: "email", type: "text" },
    { nome: "ativo", type: "text" },
  ];

  // Perfis
  const perfis = ["Admin", "Paciente"]
  
  // Status
  const listaStatus = ["Ativo", "Inativo"]

useEffect(() => {
    if (Object.keys(dadosEdicao).length > 0) {
        setdadosUsuario({
            ...dadosUsuario,
            id: dadosEdicao.id,
            nome: dadosEdicao.nome,
            perfil: dadosEdicao.perfil,
            email: dadosEdicao.email,
            codigoCadastro: dadosEdicao.codigoCadastro,
            ativo: dadosEdicao.ativo,
            master: dadosEdicao.master,
        });
    }
}, []);

  const handleDadosUsuarioChange = (event, campo) => {
    setdadosUsuario({
      ...dadosUsuario,
      [campo]: event.target.type != "checkbox" ? event.target.value : event.target.checked,
    });
  };
  
  const handleLimparCampos = () => {
    setdadosUsuario({nome: "", email: "", codigoCadastro: "", ativo: false, master: false, senha: "", confirmarSenha: ""});
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
      objUsuario = {
        ...dadosUsuario,
        senha: dadosUsuario?.senha
      }
      if (dadosEdicao.perfil == "Admin" && dadosUsuario?.senha === dadosUsuario?.confirmarSenha) {
        objUsuario = {
          ...dadosUsuario,
          senha: dadosUsuario?.senha
        }
      } else if (dadosEdicao.perfil == "Admin" && dadosUsuario?.senha != "" && dadosUsuario?.confirmarSenha == "") {
        setErrors({confirmarSenha: true})
        return
      } else if (dadosEdicao.perfil == "Admin" && dadosUsuario?.senha == "" && dadosUsuario?.confirmarSenha != "") {  
        setErrors({senha: true})
        return
      } else if (dadosEdicao.perfil == "Admin" && dadosUsuario?.senha != dadosUsuario?.confirmarSenha) {
        setErrors({senha: true, confirmarSenha: true})
        return
      }
      
      setLoading(true);
      api.put("/Usuarios/update", objUsuario)
        .then((result) => {
          if (result.status !== 200)
            throw new Error(result?.response?.data?.message);

          showMessage( "Sucesso", "Usuário editado com sucesso!", "success", () => handleReturn() );
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
              value={dadosUsuario?.nome}
              onChange={(e) => handleDadosUsuarioChange(e, "nome")}
              isInvalid={!!errors.nome}
            />
          </Form.Group>
        </Col>
        <Col md="4">
          <Form.Group className="mb-1">
            <Form.Label>
              <span className="text-danger">*</span> Perfil
            </Form.Label>
            <Form.Select
              aria-label="Default select example"
              value={dadosUsuario?.perfil ?? "Admin"}
              disabled={true}
              onChange={(e) => handleDadosUsuarioChange(e, "perfil")}
              isInvalid={!!errors.perfil}
            >
              <option value={0}>Selecione</option>
              {perfis?.map((m, index) => (
                <option key={index} value={m}>{m}</option>
              ))}
            </Form.Select>
          </Form.Group>
          {(dadosEdicao?.perfil == "Admin" || dadosUsuario?.perfil == "Admin" || dadosUsuario?.perfil == undefined)  
            && getSessionCookie()?.perfil == "Admin" 
            && getSessionCookie()?.master == "True" &&
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check 
                type="checkbox" 
                label="Master" 
                checked={dadosUsuario?.master} 
                onChange={(e) => handleDadosUsuarioChange(e, "master")}
              />
            </Form.Group>
          }
        </Col>
        <Col md="4">
          <Form.Group className="mb-3">
            <Form.Label><span className="text-danger">*</span> Email</Form.Label>
            <Form.Control
              type="text"
              placeholder="usuario@exemplo.com"
              value={dadosUsuario?.email}
              onChange={(e) => handleDadosUsuarioChange(e, "email")}
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
              value={dadosUsuario?.codigoCadastro}
              onChange={(e) => handleDadosUsuarioChange(e, "codigoCadastro")}
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
              value={dadosUsuario?.ativo}
              onChange={(e) => handleDadosUsuarioChange(e, "ativo")}
              isInvalid={!!errors.ativo}
              >
              <option value={""}>Selecione</option>
              {listaStatus?.map((m, index) => (
                <option key={index} value={m}>{m}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        {getSessionCookie()?.perfil == "Admin" && getSessionCookie()?.usuarioId == dadosEdicao?.id &&
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
                value={dadosUsuario?.senha}
              onChange={(e) => handleDadosUsuarioChange(e, "senha")}
              isInvalid={!!errors.senha}
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
                value={dadosUsuario?.confirmarSenha}
              onChange={(e) => handleDadosUsuarioChange(e, "confirmarSenha")}
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
