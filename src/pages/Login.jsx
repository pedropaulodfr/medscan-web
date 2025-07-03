import { ChangeEvent, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { showMessage } from "../helpers/message";
import Loading from "../components/Loading/Loading";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { useAuth } from "../contexts/Auth/AuthContext"
import Modals from "../components/Modals/Modals";
import { useApi } from "../api/useApi";
import Logo from "../assets/medscan-logo-verde.png";

export const Login = () => {
  const auth = useAuth();
  const api = useApi();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecuperarSenha, setIsRecuperarSenha] = useState(false);
  const [validated, setValidated] = useState(false);

  const handleEmailInput = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordInput = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async () => {
    if (email && password) {
      setLoading(true);
      await auth.login(email, password).then((result) => {
        if (result.statusCode !== 200) {
          setLoading(false);
          showMessage("Aviso", "Usuário ou senha inválidos. Tente novamente!", "error", null);
        } else {
          setLoading(false);
          navigate("/home");
        }
      });
    }
  };

  const handleRecuperacaoSenha = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      const email = form.elements.emailRecuperacao.value;
      setLoading(true);
      api.post("/Usuarios/esqueceuSenha", {email: email})
        .then((result) => {
          if (result.status !== 200)
            throw new Error(result?.response?.data?.message);
  
          showMessage("Aviso", "A senha foi enviada para o seu e-mail!", "success", null);
          setIsRecuperarSenha(false);
          setLoading(false);
        })
        .catch((err) => {
          showMessage("Erro", err, "error", null);
          setLoading(false);
        });
    }

    setValidated(true);
  };

  return (
    <div className="login d-flex justify-content-center align-items-center gradiente" style={{ minHeight: "100vh" }} >
      {loading && <Loading />}
      {isRecuperarSenha && 
        <Modals close={() => setIsRecuperarSenha(false)} title={"Recuperar Senha"} >
          <Form noValidate onSubmit={handleRecuperacaoSenha} validated={validated}>
            <Form.Group as={Col} className="mb-3" controlId="emailRecuperacao">
              <Form.Label>Email</Form.Label>
              <Form.Control  type="email" placeholder="Digite seu e-mail" required />
              <Form.Control.Feedback type="invalid" />
            </Form.Group>
            <Button type="submit" variant="primary">Recuperar Senha</Button>
          </Form>
        </Modals>
      }
      <Container>
        <Row className="justify-content-md-center">
          <Col xs={12} md={4}>
            <Form style={{borderRadius: "15px", padding: "20px", backgroundColor: "#d9e9e4dc", color: "#008952" }} >
              <Row className="justify-content-center">
                <img src={Logo} style={{ maxWidth: "300px" }} />
              </Row>
              <Row className="text-center text-secondary-emphasis m-2">
                <h2>Bem-vindo(a)!</h2>
              </Row>
              <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail" >
                <Form.Label className="text-secondary-emphasis" column sm="2"> Email</Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="email"
                    placeholder="Digite seu e-mail"
                    value={email}
                    onChange={handleEmailInput}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword" >
                <Form.Label className="text-secondary-emphasis" column sm="2">Senha</Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="password"
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={handlePasswordInput}
                  />
                </Col>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="text-secondary" column sm="4" style={{cursor: "pointer"}} onClick={setIsRecuperarSenha}>Esqueci a senha</Form.Label>
              </Form.Group>
              <Row className="justify-content-center text-center">
                <Col className="d-grid gap-2">
                  <Button className="m-2 text-white" variant="success" size="lg" onClick={handleLogin} >
                    Entrar
                  </Button>{" "}
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
