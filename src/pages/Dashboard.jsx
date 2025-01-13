import { useState, useEffect } from "react";
import moment from "moment";

// Bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

// Utils e helpers
import Loading from "../components/Loading/Loading";
import { showMessage } from "../helpers/message";

// Importar Componentes
import { Calendario } from "../components/Graficos/Calendario/Calendario";
import { Colunas } from "../components/Graficos/Colunas/Colunas";
import Cards from "../components/Cards/Cards";
import Modals from "../components/Modals/Modals";
import TabelaListagem from "../components/TabelaListagem/TabelaListagem";
import { useApi } from "../api/useApi";
import { getSessionCookie } from "../helpers/cookies";

export default function Dashboard() {
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const [dadosMedicamentos, setDadosMedicamentos] = useState([]);
  const [dadosCartaoControle, setDadosCartaoControle] = useState([]);
  const [dadosProximoAoRetorno, setDadosProximoAoRetorno] = useState([]);
  const [dadosEstoqueMedicamentos, setdadosEstoqueMedicamentos] = useState([]);
  const [cliqueCard, setCliqueCard] = useState(false);

  // Headers do Card Próximos ao Retorno
  const headersProximoAoRetorno = [
    { value: "Medicamento", objectValue: "medicamento" },
    { value: "Data Retorno", objectValue: "dataRetornoFormatada" },
  ]
  
  // Headers Medicamentos Cadastrados
  const headersMedicamentos = [
    { value: "Medicamentos", objectValue: "identificacaoFormatada" },
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        api.get("/Dashboard/cartaoControle").then((result) => {
          setDadosCartaoControle(result.data);
          setLoading(false);
        });
        
        api.get(`/Dashboard/proximoRetorno/${getSessionCookie()?.paciente_Id}`).then((result) => {
          result?.data?.map(m => {
            m.dataRetornoFormatada = moment(m.dataRetorno).format("DD/MM/YYYY")
          })
          
          setDadosProximoAoRetorno(result.data);
          setLoading(false);
        });
        
        api.get(`/Dashboard/estoqueMedicamentos/${getSessionCookie()?.paciente_Id}`).then((result) => {
          setdadosEstoqueMedicamentos(result.data);
          setLoading(false);
        });
        
        api.get("/Medicamentos/getAll").then((result) => {
          result.data.map(m => {
            m.identificacaoFormatada = `${m.identificacao} ${m.concentracao} ${m.unidade}`;
          })
          setDadosMedicamentos(result.data);
          setLoading(false);
        });
      } catch (error) {
        showMessage("Aviso", "Erro ao buscar dados: " + error, "error", null);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Data de retorno dos medicamentos
  const data = []
  dadosProximoAoRetorno?.forEach((dr) => {
    const date = moment(dr.dataRetorno).format("YYYY, MM, DD")
    data.push([new Date(date), dr.quantidade]);
  });

  const dataQuantidades = [["Medicamento", "Quantidade", { role: "style" }]];
  dadosEstoqueMedicamentos?.forEach((x, index) => {
    const style = index % 2 === 0 ? "#4374E0" : "#00C6FF";
    dataQuantidades.push([x.medicamento, x.quantidade, style])
  })

  const [titleModal, setTitleModal] = useState("");
  const [textModal, setTextModal] = useState();

  // Definir a informação mostrada ao clicar em cada card
  const ModalElements = (card) => {
    var _titleModal = "";
    var _textModal;

    switch (card) {
      case 1:
        _titleModal = "Medicamentos próximos ao retorno"
        _textModal = <TabelaListagem headers={headersProximoAoRetorno} itens={dadosProximoAoRetorno} />
        break;
      
        case 2:
        _titleModal = "Medicamentos"
        _textModal = <TabelaListagem headers={headersMedicamentos} itens={dadosMedicamentos} />
        
      default:
        break;
      }
      setTitleModal(_titleModal);
      setTextModal(_textModal);
  }

  return (
    <Container>
      {loading && <Loading />}
      {cliqueCard && <Modals close={setCliqueCard} title={titleModal} text={textModal} />}
      <Row className="justify-content-md-center">
        <Col className="d-flex justify-content-center" >
          <h1 className="title-page">Dashboard</h1>
        </Col>
      </Row>
      <Form className="text-black mb-4 shadow p-3 mb-5 bg-white rounded d-flex justify-content-center" style={{borderRadius: "15px",padding: "20px",}} >
        <Row>
          <Col onClick={() => {ModalElements(1)}}>
            <Cards titleHeader="Próximo ao retorno" text="Clique para ver detalhes" textAlign="center" cursorType="pointer" click={setCliqueCard} >
            <div className="flex flex-col justify-center items-center text-center">
              <h1>{dadosProximoAoRetorno[0]?.quantidade ?? 0}</h1>
              <span>Clique para ver detalhes</span>
            </div>
            </Cards>
          </Col>
          <Col onClick={() => {ModalElements(2)}}>
            <Cards titleHeader="Quantidade de Medicamentos" textAlign="center" cursorType="pointer" click={setCliqueCard}>
                <div className="flex flex-col justify-center items-center text-center">
                  <h1>{dadosMedicamentos?.length ?? 0}</h1>
                  <span>Clique para ver detalhes</span>
              </div>
            </Cards>
          </Col>
        </Row>
      </Form>
      <Form className="text-black mb-4 shadow p-3 mb-5 bg-white rounded" style={{borderRadius: "15px",padding: "20px",}} >
        <Row>
          <h3>Datas de Retorno</h3>
        </Row>
        <Row>
          <Col>
            <Calendario data={data} />
          </Col>
        </Row>
      </Form>
      {Object.keys(dadosEstoqueMedicamentos).length > 0 &&
        <Form className="text-black mb-4 shadow p-3 mb-5 bg-white rounded" style={{borderRadius: "15px",padding: "20px",}} >
          <Row>
            <h3>Estoque Medicamentos</h3>
          </Row>
          <Row>
            <Col>
              <Colunas data={dataQuantidades} />    
            </Col>
          </Row>
        </Form>
      }
    </Container>
  );
}
