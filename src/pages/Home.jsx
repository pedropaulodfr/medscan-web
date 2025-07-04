import {  useContext  } from "react";
import Logotipo from "../assets/medscan-logo-verde.png";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import AuthContext from "../contexts/Auth/AuthContext";
import { useAuth } from "../contexts/Auth/AuthContext";

export default function Home() {
  const { userAcesso } = useContext(AuthContext);
  const auth = useAuth();

  const handleCard = (route) => {
    window.location.href = `/${route}`;
  };

  const actions = [
    {label: "Dashboard", color: "outline-success", modulo: "Paciente", path: "dashboard"},
    {label: "Verificar Cartão", color: "outline-info", modulo: "Paciente", path: "card"},
    {label: "Pacientes", color: "outline-success", modulo: "Admin", path: "pacientes"},
    {label: "Usuarios", color: "outline-info", modulo: "Admin", path: "usuarios"},
    {label: "Análise Solicitação", color: "outline-warning", modulo: "Admin", path: "analiseSolicitacao"},
  ];

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col>
          <div
            className="logo"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img src={Logotipo} width={250} />
          </div>
        </Col>
      </Row>
      <hr></hr>
      <Row>
        <Col xs={3}></Col>
        <Col>
          <span>
            <center>
              <h3>Bem-vindo ao MedScan!</h3>
            </center>
            <br />
            <i style={{ color: "gray" }}>
              "No coração da nossa missão está o compromisso com a saúde e o
              bem-estar. O MedScan nasceu da necessidade de simplificar e
              aprimorar a gestão de medicamentos, tornando-a mais acessível e
              eficiente para todos."
            </i>
          </span>
        </Col>
        <Col xs={3}></Col>
      </Row>
      {auth?.notificacoes.length > 0 &&
        <>
          <Row className="justify-content-center mt-5">
            <Col md="auto">
                <span><i class="bi bi-bell-fill text-warning"></i> Você possui notificações não lidas!</span>
            </Col>
          </Row>
          <Row  className="justify-content-center" md="auto">
            <Button variant="warning" className="m-2 mt-0.5" onClick={() => {handleCard("notificacoes")}}>Visualizar</Button>
          </Row>
        </>
      }
      <Row className="justify-content-md-center mt-5">
        <Col md="auto">
          <h4 style={{ color: "#00C7E9" }}>O que deseja fazer?</h4>
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <Col md="auto">
          {actions?.map(action => {
            if (userAcesso?.perfil == action.modulo) {
              return (
                <Button variant={action.color} className="m-2 mt-0.5" onClick={() => {handleCard(action.path)}}>
                  {action.label}
                </Button>
              )
            }
          })}
        </Col>
      </Row>
    </Container>
  );
}
