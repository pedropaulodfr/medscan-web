import React from "react";

// Bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

export default function InputWithButtons({ dados, handleRemover, errors }) {
  return (
    <div
      style={{
        minHeight: "60px",
        border: "1px solid #ced4da",
        borderRadius: "4px",
        padding: "8px",
        background: "#f8f9fa",
        display: "flex",
        flexWrap: "wrap",
        gap: "8px",
      }}
    >
      {dados.length > 0 ? (
        dados.map((x) => (
          <span
            key={x.id}
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: "#50BF84",
              color: "#fff",
              borderRadius: "16px",
              padding: "4px 12px",
              fontSize: "0.95em",
              marginRight: "4px",
            }}
          >
            {x.nome}
            <Button
              size="sm"
              variant="link"
              style={{ color: "#fff", marginLeft: "6px", padding: 0 }}
              onClick={() => handleRemover(x.id)}
              aria-label={`Remover ${x.nome}`}
            >
              <i className="bi bi-x-lg"></i>
            </Button>
          </span>
        ))
      ) : (
        <span style={{ color: "#aaa" }}>Nenhum medicamento vinculado</span>
      )}
    </div>
  );
}
