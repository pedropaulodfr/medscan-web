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
import { useApi } from "../../api/useApi";
import CardRelatorio from "../../components/Cards/CardRelatorio";
import Logotipo from "../../assets/medscan-logo-verde.png";

export default function RelatorioMedicamentos () {
    const api = useApi();
    const [dadosRelatorio, setDadosRelatorio] = useState([]);
    const [filtro, setFiltro] = useState({});
    const [isFiltro, setIsFiltro] = useState(false);
    const [loading, setLoading] = useState(false);

    const headers = [
        { value: "Medicamento", objectValue: "medicamento" },
        { value: "Tipo", objectValue: "tipo" },
        { value: "Associado", objectValue: "associacao" },
        { value: "Status", objectValue: "status" },
    ];

  // Filtros
    const camposFiltrados = [ ]

    const statusFiltro = ["Ativo", "Inativo"]

    const handleFiltroChange = (event, campo) => {
        let newValue;
        if (event.target.type == "checkbox") {
            newValue = event.target.checked;
        } else {
            newValue = event.target.value;
        }
        setFiltro({ ...filtro,[campo]: newValue, });
    };

    const handleLimparFiltro = () => {
        setFiltro({});
        setIsFiltro(false);
    };

    const onSubmit = async () => {
        try {
            setLoading(true);
            api.post("/Relatorios/relatorioMedicamentos", filtro).then((result) => {
                const dadosOrdenados = result.data.sort((a, b) => a.medicamento.localeCompare(b.medicamento));
                setDadosRelatorio(dadosOrdenados);
                setLoading(false);
            });
            } catch (error) {
            showMessage("Aviso", "Erro ao buscar dados: " + error, "error", null);
            setLoading(false);
        }
    }

    const handlePrint = () => {
        const printContents = document.getElementById("printable-area").innerHTML;
        const originalContents = document.body.innerHTML;

        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload();
    }

    const handleReturn = () => { }

    return (
        <Container>
            {loading && <Loading />}
            <Row className="justify-content-md-center">
                <Col className="d-flex justify-content-center">
                <h1 className="title-page">Relatório de Medicamentos </h1>
                </Col>
            </Row>
            <Row>
                <Col md>
                    <h4>Filtros</h4>
                </Col>
            </Row>
            <Form className="text-black mb-4 shadow p-3 mb-5 bg-white rounded">
                <Row className="filtros">
                    {camposFiltrados != null &&
                        camposFiltrados.map(m => {
                            return (
                                <Col md="3">
                                    <Form.Group className="mb-3">
                                    <Form.Label>{m.label}</Form.Label>
                                    <Form.Control
                                        type={m.tipo}
                                        placeholder=""
                                        value={filtro[m.campo] || ""}
                                        onChange={(e) => handleFiltroChange(e, m.campo)}
                                    />
                                    </Form.Group>
                                </Col>
                            )
                        })
                    }
                    <Col md="3">
                        <Form.Group className="mb-3">
                            <Form.Label>Status</Form.Label>
                            <Form.Select
                                aria-label="Default select example"
                                value={filtro.status || ""}
                                onChange={(e) => handleFiltroChange(e, "status")}
                            >
                            <option value={""}>Todos</option>
                            {statusFiltro?.map((m, index) => (
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
                            onClick={onSubmit}
                        >
                            <i className="bi bi-file-earmark-text-fill"></i> Emitir Relatório
                        </Button>{" "}
                    {isFiltro && (
                        <>
                            <Button
                                className="m-3 mb-0 mt-2 text-white"
                                variant="info"
                                style={{ backgroundColor: "#66b3ff", borderColor: "#66b3ff" }}
                                onClick={handleLimparFiltro}
                            >
                                <i className="bi bi-eraser"></i> Limpar Filtros
                            </Button>{" "}
                        </>
                    )}
                    </Col>
                </Row>
            </Form>
            {dadosRelatorio.length > 0 && 
                <>
                    <Row>
                        <Col>
                            <Button
                                className="m-3 mb-0 mt-2 text-white"
                                variant="info"
                                onClick={handlePrint}
                            >
                                <i className="bi bi-printer-fill"></i> Imprimir
                            </Button>{" "}
                        </Col>
                    </Row>  
                    <Form id="printable-area" className="text-black mb-4 shadow p-3 mb-5 bg-white rounded">
                        <Row>
                            <Col className="d-flex justify-content-center m-3">
                                <img src={Logotipo} className="img-fluid" width={250} />
                            </Col>
                        </Row>
                        <hr></hr>
                        <Row>
                            <Col className="d-flex justify-content-center m-3">
                                <h4 className="text-success">Relatório de Medicamentos</h4>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="mb-5 d-flex flex-row">
                                <span className="me-4"><span className="fw-bold text-danger-emphasis">Status: </span> {filtro.status ? filtro.status == "true" ? "Inativo" : "Ativo" : "Todos" }</span>
                            </Col>
                        </Row>
                        <Row className="justify-content-center">
                            <Col>
                                <CardRelatorio headers={headers} items={dadosRelatorio} />
                            </Col>
                        </Row>
                    </Form>
                </>
            }
        </Container>
    );
}