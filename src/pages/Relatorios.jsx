import { useState, useEffect } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

// Utils e helpers
import Loading from "../components/Loading/Loading";
import { showMessage } from "../helpers/message";

export default function Relatorios() {
    const [loading, setLoading] = useState(false);

  return (
    <Container>
      {loading && <Loading />}
      <Row className="justify-content-md-center">
        <Col className="d-flex justify-content-center" >
          <h1 className="title-page">Relatórios</h1>
        </Col>
      </Row>
    </Container>
  );
}
