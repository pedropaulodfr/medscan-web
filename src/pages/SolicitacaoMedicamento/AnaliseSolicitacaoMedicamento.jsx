import { useState, useEffect } from "react";

// Bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import TabelaListagem from "../../components/TabelaListagem/TabelaListagem";
import Form from "react-bootstrap/Form";
import Alert from 'react-bootstrap/Alert';

// Utils e helpers
import Loading from "../../components/Loading/Loading";
import { showMessage, showQuestion } from "../../helpers/message";
import { useApi } from "../../api/useApi";

export default function AnaliseSolicitacaoMedicamento() {
  const api = useApi();
  const [dadosSolicitacoesMedicamentos, setDadosSolicitacoesMedicamentos] = useState([]);
  const [_dadosSolicitacoesMedicamentos, set_DadosSolicitacoesMedicamentos] = useState([]);
  const [isFiltro, setIsFiltro] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addSolicitacaoMedicamento, setAddSolicitacaoMedicamento] = useState(false);
  const [atualizarTabela , setAtualizarTabela]  = useState(false);
  const [analiseAutomatica, setAnaliseAutomatica] = useState(false);

  const headers = [
    { value: "Medicamento", objectValue: "identificacao" },
    { value: "Concentração", objectValue: "concentracaoUnidade" },
    { value: "Descrição", objectValue: "descricao" },
    { value: "Tipo", objectValue: "tipoMedicamento" },
    { value: "Paciente", objectValue: "paciente" },
    { value: "Status", objectValue: "status" },
  ];

  const listaStatus = ["Todos", "Aprovado", "Reprovado", "Em Análise"]

  const handleDelete = (item) => {
    showQuestion("Tem certeza?", "Tem certeza que deseja excluir o registro? Esta ação é irreversível", "info",
      (confirmation) => {
        if (confirmation) {
          setLoading(true);
          api.delete("/Solicitacoes/delete", item.id).then((result) => {
            if (result.status !== 200) throw new Error(result?.response?.data?.message);
              
            showMessage( "Sucesso", "Solicitacao de medicamento deletada com sucesso!", "success", null);
            setLoading(false);
            setAtualizarTabela(true)
          })
          .catch((err) => {showMessage( "Erro", err, "error", null); setLoading(false)})
        }
      }
    );
  }
  
  const handleAnalisar = (item, aprovado) => {
      setLoading(true);
      api.get(`/Solicitacoes/analiseSolicitacao/${item.id}/${aprovado}`).then((result) => {
        if (result.status !== 200)
          throw new Error(result?.response?.data?.message);
        
        showMessage("Sucesso", "Análise de medicamento realizada com sucesso!", "success", null);
        setAtualizarTabela(true)
      })
      .catch((err) => {
        showMessage("Erro", err, "error", null);
        setLoading(false);
      });
    }

  // Açõeas da tabela
  const actions = [
    { icon: "bi bi-check-lg text-white", color: "success", action: (item) => handleAnalisar(item, true)},
    { icon: "bi bi-x-circle-fill text-white", color: "danger", action: (item) => handleAnalisar(item, false)},
    { icon: "i bi-trash-fill", color: "dark", action: handleDelete},
  ];

  // Filtros
  const [medicamentoFiltro, setMedicamentoFiltro] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("");

  const handleMedicamentoChange = (event) => {
    setMedicamentoFiltro(event.target.value);
  };
  
  const handleStatusChange = (event) => {
    setStatusFiltro(event.target.value);
  };


  useEffect(() => {
    setAtualizarTabela(false)
    const fetchData = async () => {
      try {
        setLoading(true);
        await api.get(`/Solicitacoes/getAll/Todos`).then((result) => {
          result.data?.map((m) => {
            m.concentracaoUnidade = `${m.concentracao} ${m.unidade}`;
          });

          const dadosOrdenados = result.data?.sort((a, b) => a.identificacao?.localeCompare(b.identificacao));
          setDadosSolicitacoesMedicamentos(dadosOrdenados);
          set_DadosSolicitacoesMedicamentos(dadosOrdenados);
          setLoading(false);
        });

        await api.get(`/Setup`).then((result) => {
          setAnaliseAutomatica(result?.data?.analiseAutomatica)
        });
      } catch (error) {
        showMessage("Aviso", "Erro ao buscar dados: " + error, "error", null);
        setLoading(false);
      }
    };

    fetchData();
  }, [addSolicitacaoMedicamento, setAddSolicitacaoMedicamento, atualizarTabela]);

  const handleFiltro = () => {
    // Resetar os dados para o estado original
    setDadosSolicitacoesMedicamentos(dadosSolicitacoesMedicamentos);

    // Verificar se algum filtro foi preenchido
    if (medicamentoFiltro === "" && statusFiltro === "") {
      showMessage("Aviso", "Informe ao menos um dos campos!", "error", null);
      return;
    }

    // Criar uma cópia dos dados originais para aplicar os filtros
    let dadosFiltrados = [...dadosSolicitacoesMedicamentos];

    if (medicamentoFiltro.trim() !== "") {
      dadosFiltrados = dadosFiltrados.filter((item) =>
        item.identificacao
          .toLowerCase()
          .includes(medicamentoFiltro.trim().toLowerCase())
      );
    }
    if (statusFiltro.trim() !== "") {
      dadosFiltrados = dadosFiltrados.filter((item) =>
        item.status
          .toLowerCase()
          .includes(statusFiltro.trim().toLowerCase())
      );
    }

    setIsFiltro(true);
    setDadosSolicitacoesMedicamentos(dadosFiltrados);
  };

  const handleLimparFiltro = () => {
    setMedicamentoFiltro("");
    setStatusFiltro("");
    setDadosSolicitacoesMedicamentos(_dadosSolicitacoesMedicamentos);
    setIsFiltro(false);
  };

  return (
    <Container>
      {loading && <Loading />}
      <Row className="justify-content-md-center">
        <Col className="d-flex justify-content-center">
          <h1 className="title-page">Análise Solicitação de Medicamentos</h1>
        </Col>
      </Row>
      <Row>
        <Col md>
          <h4>Filtros</h4>
        </Col>
      </Row>
      <Form className="text-black mb-4 shadow p-3 mb-5 bg-white rounded">
        <Row className="filtros">
          <Col md="3">
            <Form.Group className="mb-3">
              <Form.Label>Medicamento</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                value={medicamentoFiltro}
                onChange={(e) => {handleMedicamentoChange(e)}}
              />
            </Form.Group>
          </Col>
          <Col md="3">
              <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                      aria-label="Default select example"
                      value={statusFiltro || ""}
                      onChange={(e) => handleStatusChange(e, "Todos")}
                  >
                  {listaStatus?.map((m, index) => (
                      <option key={index} value={m}>{m}</option>
                  ))}
                  </Form.Select>
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
                  style={{backgroundColor: "#50BF84", borderColor: "#50BF84",}}
                  onClick={handleLimparFiltro}
                >
                  <i className="bi bi-eraser"></i> Limpar Filtros
                </Button>{" "}
              </>
            )}
          </Col>
        </Row>
      </Form>
      {analiseAutomatica &&
        <Row>
          <Col className="m-1" xs={0}>
            <Alert variant="warning">
              <b>Atenção:</b> A análise automática está ativada.
              Todas as solicitações estão sendo aprovadas automaticamente.
              Para alterar esse comportamento, acesse a tela de <b>Setup</b>.
            </Alert>
          </Col>
        </Row>
      }
      <Form className="text-black mb-4 shadow p-3 mb-5 bg-white rounded">
        <Row className="justify-content-center">
          <Col>
            <TabelaListagem headers={headers} itens={dadosSolicitacoesMedicamentos} actions={actions} />
          </Col>
        </Row>
      </Form>
    </Container>
  );
}
