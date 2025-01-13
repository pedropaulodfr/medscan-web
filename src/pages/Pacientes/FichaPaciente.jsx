import { useState } from "react";
import moment from "moment";

// Bootstrap
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function FichaPaciente( { dados = [] } ) {
  const [dadosUsuario, setDadosUsuario] = useState(dados)

  return (
    <>
        <Row className="text-black mb-4 shadow p-3 mb-5 bg-white rounded" style={{ borderRadius: "15px", padding: "20px" }} >
            <Col lg="12" sm="12">
                <span className="fw-semibold">Perfil:</span> <span>{dadosUsuario?.perfil}</span>
            </Col>
            <Col lg="4" sm="12">
                <span className="fw-semibold">Nome:</span> <span>{dadosUsuario?.paciente?.nome}</span>
            </Col>
            <Col lg="4" sm="12">
                <span className="fw-semibold">Nome Completo:</span> <span>{dadosUsuario?.paciente?.nomeCompleto}</span>
            </Col>
            <Col lg="4" sm="12">
                <span className="fw-semibold">Data de Nascimento:</span> <span>{moment(dadosUsuario?.paciente.dataNascimento).format("DD/MM/YYYY")}</span>
            </Col>
            <Col lg="4" sm="12">
                <span className="fw-semibold">E-mail:</span> <span>{dadosUsuario?.paciente?.email}</span>
            </Col>
            <Col lg="4" sm="12">
                <span className="fw-semibold">Endereço:</span> <span>{dadosUsuario?.paciente?.endereco}</span>
            </Col>
            <Col lg="4" sm="12">
                <span className="fw-semibold">Plano de Saúde:</span> <span>{dadosUsuario?.paciente?.planoSaude}</span>
            </Col>
            <Col lg="4" sm="12">
                <span className="fw-semibold">Código Cadastro:</span> <span>{dadosUsuario?.codigoCadastro}</span>
            </Col>
            <Col lg="4" sm="12">
                <span className="fw-semibold">CNS:</span> <span>{dadosUsuario?.paciente?.cns}</span>
            </Col>
            <Col lg="4" sm="12">
                <span className="fw-semibold">Status:</span> <span>{dadosUsuario?.ativo}</span>
            </Col>
        </Row>
    </>
  );
}
