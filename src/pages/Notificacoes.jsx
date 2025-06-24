import { useState, useEffect } from "react";
import moment from "moment";

// Bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Accordion from 'react-bootstrap/Accordion';


// Utils e helpers
import { useApi } from "../api/useApi";
import { showMessage } from "../helpers/message";
import Loading from "../components/Loading/Loading";

const Notificacoes = () => {
  const api = useApi();
  const [dadosNotificacoes, setDadosNotificacoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [atualizarTabela, setAtualizarTabela] = useState(false);

  useEffect(() => {
    setAtualizarTabela(false);
    const fetchData = async () => {
      try {
        setLoading(true);
        api.get("/Notificacoes/getAllNotificacoes").then((result) => {
          setDadosNotificacoes(result.data);
          setLoading(false);
        });
      } catch (error) {
        showMessage("Aviso", "Erro ao buscar dados: " + error, "error", null);
        setLoading(false);
      }
    };

    fetchData();
  }, [atualizarTabela]);

  const onSubmit = (notificacaoId) => {
      setLoading(true);
      api
      .get(`/Notificacoes/updateNotificacaoLida/${notificacaoId}`)
      .then((result) => {
          if (result.status !== 200)
            throw new Error(result?.response?.data?.message);
  
          setAtualizarTabela(true);
          setLoading(false);
      })
      .catch((err) => {
          showMessage("Erro", err, "error", null);
          setLoading(false);
      });
    };

  return (
    <Container>
      {loading && <Loading />}
      <Row className="justify-content-md-center">
        <Col className="d-flex justify-content-center">
          <h1 className="title-page">Central de Notificações</h1>
        </Col>
      </Row>
      <Container className="text-black mb-4 shadow p-3 mb-5 bg-white rounded">
        
        <Row className="filtros">
          <Col md="6">
            <Row>
              <Col md>
                <h4>{"Não lidas"}</h4>
              </Col>
            </Row>
            <Row>
              {dadosNotificacoes?.filter(f => f.lido != true)?.map((notificacao, index) => {
                  return (
                      <Accordion defaultActiveKey="0">
                          <Accordion.Item eventKey={index} onClick={() => onSubmit(notificacao.notificacao_Id)}>
                              <Accordion.Header>
                                  <div style={{fontWeight: "bold"}}> 
                                    <i class="bi bi-exclamation-circle me-3" style={{color: "orange"}}></i> 
                                    📆{moment(notificacao.data).format("DD/MM/YYYY")} - {notificacao.titulo}
                                  </div>
                              </Accordion.Header>
                              <Accordion.Body>
                                  <p>A data de retorno do seu medicamento está próxima.</p>
                                  <p>💊 <b>Medicamento:</b> {notificacao.medicamento} <br></br></p>
                                  <p><small>Para mais detalhes, verifique o dashboard!</small></p>
                              </Accordion.Body>
                          </Accordion.Item>
                      </Accordion>
                  )
              })}
            </Row>
          </Col>
          <Col md="6">
          <Row>
              <Col md>
                <h4>{"Todas"}</h4>
              </Col>
            </Row>
            <Row>
              {dadosNotificacoes?.map((notificacao, index) => {
                  return (
                      <Accordion defaultActiveKey="0">
                          <Accordion.Item eventKey={index} onClick={notificacao.lido != true ? () => onSubmit(notificacao.notificacao_Id) : null}>
                              <Accordion.Header>
                                  <div style={{fontWeight: notificacao.lido != true ? "bold" : "normal"}}>
                                      {notificacao.lido != true 
                                          ? <i class="bi bi-exclamation-circle me-3" style={{color: "orange"}}></i> 
                                          : <i class="bi bi-check-lg me-3" style={{color: "green"}}></i>
                                      } 
                                      📆{moment(notificacao.data).format("DD/MM/YYYY")} - {notificacao.titulo}
                                  </div>
                              </Accordion.Header>
                              <Accordion.Body>
                                  <p>A data de retorno do seu medicamento está próxima.</p>
                                  <p>💊 <b>Medicamento:</b> {notificacao.medicamento} <br></br></p>
                                  <p><small>Para mais detalhes, verifique o dashboard!</small></p>
                              </Accordion.Body>
                          </Accordion.Item>
                      </Accordion>
                  )
              })}
            </Row>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default Notificacoes;
