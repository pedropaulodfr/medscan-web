import { useState, useEffect, useContext } from "react";
import moment from "moment";

// Bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

// Utils e helpers
import Loading from "../components/Loading/Loading";
import { showMessage } from "../helpers/message";

// Importar Componentes
import { Colunas } from "../components/Graficos/Colunas/Colunas";
import Cards from "../components/Cards/Cards";
import Modals from "../components/Modals/Modals";
import TabelaListagem from "../components/TabelaListagem/TabelaListagem";
import { useApi } from "../api/useApi";
import AuthContext from "../contexts/Auth/AuthContext";
import CalendarioMaior from "../components/Graficos/CalendarioMaior/CalendarioMaior";

export default function Dashboard() {
  const api = useApi();
  const { userAcesso } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [dadosProximoAoRetorno, setDadosProximoAoRetorno] = useState([]);
  const [dadosRetorno, setDadosRetorno] = useState([]);
  const [dadosEstoqueMedicamentos, setdadosEstoqueMedicamentos] = useState([]);
  const [dadosQntMedicamentosPaciente, setDadosQntMedicamentosPaciente] = useState([]);
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
        api.get(`/Dashboard/proximoRetorno/${userAcesso?.pacienteId}`).then((result) => {
          result?.data?.map(m => {
            m.dataRetornoFormatada = moment(m.dataRetorno).format("DD/MM/YYYY")
          })
          
          setDadosProximoAoRetorno(result.data);
          setLoading(false);
        });
        
        api.get(`/Dashboard/datasRetorno/${userAcesso?.pacienteId}`).then((result) => {
          result?.data?.map(m => {
            m.dataRetornoFormatada = moment(m.dataRetorno).format("DD/MM/YYYY")
          })
          
          setDadosRetorno(result.data);
          setLoading(false);
        });
        
        api.get(`/Dashboard/estoqueMedicamentos/${userAcesso?.pacienteId}`).then((result) => {
          setdadosEstoqueMedicamentos(result.data);
          setLoading(false);
        });
        
        api.get("/Dashboard/qntMedicamentosPaciente/").then((result) => {
          
          result?.data?.map(m => {
            m.identificacaoFormatada = `${m.identificacao} ${m.concentracao} ${m.unidade}`;
          })
          setDadosQntMedicamentosPaciente(result.data);
          setLoading(false);
        });
      } catch (error) {
        showMessage("Aviso", "Erro ao buscar dados: " + error, "error", null);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Data próximas de retorno dos medicamentos
  const data = []
  dadosProximoAoRetorno?.forEach((dr) => {
    const date = moment(dr.dataRetorno);
    data.push({
      "title": dr.medicamento,
      "allDay": true,
      "start": new Date(date.year(), date.month(), date.date()),
      "end": new Date(date.year(), date.month(), date.date())
    });
  });
  
  // Data de retorno dos medicamentos
  const dataRetorno = []
  dadosRetorno?.forEach((dr) => {
    const date = moment(dr.dataRetorno);
    dataRetorno.push({
      "title": dr.medicamento,
      "allDay": true,
      "start": new Date(date.year(), date.month(), date.date()),
      "end": new Date(date.year(), date.month(), date.date())
    });
  });

  const dataQuantidades = [["Medicamento", "Quantidade", { role: "style" }]];
  
  if(dadosEstoqueMedicamentos.length > 0)
  {
    dadosEstoqueMedicamentos?.forEach((x, index) => {
      const style = index % 2 === 0 ? "#4374E0" : "#00C6FF";
      dataQuantidades.push([x.medicamento, x.quantidade, style])
    })
  }

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
        _textModal = <TabelaListagem headers={headersMedicamentos} itens={dadosQntMedicamentosPaciente} />
        
      default:
        break;
      }
      setTitleModal(_titleModal);
      setTextModal(_textModal);
  }

  return (
    <Container>
      {loading && <Loading />}
      {cliqueCard && <Modals close={setCliqueCard} title={titleModal}>{textModal}</Modals>}
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
                <h1>{dadosProximoAoRetorno?.length ?? 0}</h1>
                <span>Clique para ver detalhes</span>
              </div>
            </Cards>
          </Col>
          <Col onClick={() => {ModalElements(2)}}>
            <Cards titleHeader="Quantidade de Medicamentos" textAlign="center" cursorType="pointer" click={setCliqueCard}>
              <div className="flex flex-col justify-center items-center text-center">
                <h1>{dadosQntMedicamentosPaciente?.length ?? 0}</h1>
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
            <CalendarioMaior events={dataRetorno} />
          </Col>
        </Row>
      </Form>
      {dadosEstoqueMedicamentos.length > 0 &&
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
