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

export const Login = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
          showMessage(
            "Aviso",
            "Usuário ou senha inválidos. Tente novamente!",
            "error",
            null
          );
        } else {
          setLoading(false);
          navigate("/home");
        }
      });
    }
  };

  return (
    <div
      className="login d-flex justify-content-center align-items-center gradiente"
      style={{ minHeight: "100vh" }}
    >
      {loading && <Loading />}
      <Container>
        <Row className="justify-content-md-center">
          <Col xs={12} md={4}>
            <Form
              className=""
              style={{  borderRadius: "15px", padding: "20px", backgroundColor: "#d9e9e4dc", color: "#008952" }}
            >
              <h2>Bem Vindo!</h2>
              <Form.Group
                as={Row}
                className="mb-3"
                controlId="formPlaintextEmail"
              >
                <Form.Label column sm="2">
                  Email
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="email"
                    placeholder="Digite seu e-mail"
                    value={email}
                    onChange={handleEmailInput}
                  />
                </Col>
              </Form.Group>
              <Form.Group
                as={Row}
                className="mb-3"
                controlId="formPlaintextPassword"
              >
                <Form.Label column sm="2">
                  Senha
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="password"
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={handlePasswordInput}
                  />
                </Col>
              </Form.Group>
              <Row className="justify-content-md-center">
                <Col md="auto">
                  <Button
                    onClick={handleLogin}
                    style={{
                      backgroundColor: "#3F8576",
                      borderColor: "#D6EDE7",
                      color: "#ffffff",
                      margin: "15px",
                    }}
                    size="lg"
                  >
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
