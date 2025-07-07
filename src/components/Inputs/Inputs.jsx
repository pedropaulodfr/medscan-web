import React from "react";

// Bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

export default function Input({ campos, dados, handleChangeDados, errors }) {
    return (
    <Row>
        {campos != null && Object.keys(campos).length > 0 &&
        campos.map((campo, index) => { 
            if (campo.type == "select" && campo?.hide != true) {
                return (
                    <Col md="4">
                        <Form.Group className="mb-3">
                            <Form.Label><span className="text-danger">{campo.obrigatorio && "*" }</span>{" "}{campo.label}</Form.Label>
                            <Form.Select
                                aria-label={campo.placeholder}
                                disabled={campo.disabled}
                                name={campo.name}
                                value={dados?.[campo.name]}
                                onChange={(e) => handleChangeDados(e)}
                                isInvalid={!!errors[campo.name]}
                            >
                            <option value={""}>Selecione</option>
                            {campo?.options?.type == "array" && campo?.options?.selects?.map((m, index) => (
                                <option key={index} value={m}>{m}</option>
                            ))}
                            {campo?.options?.type == "object" && campo?.options?.selects?.map((m, index) => (
                                <option key={index} value={m.id}>{m[campo?.options.label]}</option>
                            ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                )
            } else if(campo?.hide != true){
                return (
                    <Col md="4">
                        <Form.Group className="mb-1">
                            <Form.Label>
                            <span className="text-danger">{campo.obrigatorio && "*"}</span>{" "}{campo.label}
                            </Form.Label>
                            <Form.Control
                                type={campo.type}
                                disabled={campo.disabled}
                                name={campo.name}
                                placeholder={campo.placeholder}
                                value={dados[campo.name]}
                                onChange={(e) => handleChangeDados(e)}
                                isInvalid={!!errors[campo.name]}
                            />
                        </Form.Group>
                    </Col>
                )
            }
        })}
    </Row>
    );
}
