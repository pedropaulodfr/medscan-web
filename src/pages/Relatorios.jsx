import { useState, useContext } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

// Utils e helpers
import AuthContext from "../contexts/Auth/AuthContext";

//Components
import Cards from "../components/Cards/Cards";
import RelatorioMedicamentos from "./reports/RelatorioMedicamentos";
import RelatorioReceituario from "./reports/RelatorioReceituario";

export default function Relatorios() {
  const { userAcesso } = useContext(AuthContext)
  const [exibirRelatorio, setExibirRelatorio] = useState(null);

  const listaRelatorios = [
    {label: "Relatório de Medicamentos", identificacao: "medicamentos", modulo: "Admin"},
    {label: "Relatório Receituário", identificacao: "receituario", modulo: "Paciente"},
  ]

  const handleReturn = () => { 
    setExibirRelatorio(null)
  }

  if(exibirRelatorio != null) {
    switch (exibirRelatorio) {
      case "medicamentos":
        return <RelatorioMedicamentos handleReturn={handleReturn} />
      case "receituario":
        return <RelatorioReceituario handleReturn={handleReturn} />
      default:
        break;
    }
  }

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col className="d-flex justify-content-center" >
          <h1 className="title-page">Relatórios</h1>
        </Col>
      </Row>
      <Form className="text-black mb-4 shadow p-3 mb-5 bg-white rounded" style={{ borderRadius: "15px", padding: "20px", }} >
        <Row className="m-2">
          {listaRelatorios?.filter(f => f.modulo == userAcesso?.perfil)?.map((relatorio, index) => {
            return(
              <Col key={index} xs={12} md={4}>
                <Cards titleHeader={relatorio.label} text="Clique para ver detalhes" textAlign="center" cursorType="pointer" click={() => setExibirRelatorio(relatorio.identificacao)} >
                  <div className="flex flex-col justify-center items-center text-center">
                    <h1><i className="bi bi-file-earmark-text-fill text-success"></i></h1>
                    <span className="text-success">Visualizar Relatório</span>
                  </div>
                </Cards>
              </Col>
            )
          })}
        </Row>
      </Form>
    </Container>
  );
}
