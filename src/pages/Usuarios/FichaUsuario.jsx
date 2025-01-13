import { useState, useEffect } from "react";
import moment from "moment";

// Bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";

// Utils e helpers
import Loading from "../../components/Loading/Loading";
import { showMessage } from "../../helpers/message";

// Importar Componentes
import { useApi } from "../../api/useApi";

export default function FichaUsuario( { dados = [] } ) {
  const api = useApi();
  const [dadosUsuario, setDadosUsuario] = useState(dados)

  return (
    <>
        <Row className="text-black mb-4 shadow p-3 mb-5 bg-white rounded" style={{ borderRadius: "15px", padding: "20px" }} >
            <Col lg="12" sm="12">
                <span className="fw-semibold">Perfil:</span> <span>{dadosUsuario?.perfil}</span>
            </Col>
            <Col lg="4" sm="12">
                <span className="fw-semibold">Nome:</span> <span>{dadosUsuario?.nome}</span>
            </Col>
            <Col lg="4" sm="12">
                <span className="fw-semibold">E-mail:</span> <span>{dadosUsuario?.email}</span>
            </Col>
            <Col lg="4" sm="12">
                <span className="fw-semibold">Código Cadastro:</span> <span>{dadosUsuario?.codigoCadastro}</span>
            </Col>
            <Col lg="4" sm="12">
                <span className="fw-semibold">Status:</span> <span>{dadosUsuario?.ativo}</span>
            </Col>
        </Row>
    </>
  );
}
