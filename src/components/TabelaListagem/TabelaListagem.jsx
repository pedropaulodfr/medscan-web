import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import "./TabelaListagem.css";
import { Alert } from "react-bootstrap";


function TabelaListagem({ headers = [], itens = [], actions = [] }) {
  return (
    <>
      <Table striped bordered hover responsive="lg" >
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index} style={{ backgroundColor: "#008952", color: "#F2F0D8" }}>{header.value}</th>
            ))}
            {Object.keys(actions).length > 0 &&
              <th style={{ backgroundColor: "#008952", color: "#F2F0D8" }}>Ações</th>
            }
          </tr>
        </thead>
        <tbody>
          {itens.map((item, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((header, colIndex) => (
                <td style={{ backgroundColor: rowIndex % 2 == 0 ? "#f9f9f9" : "#fffef2" }} key={colIndex}>{item[header.objectValue]}</td>
              ))}
              {Object.keys(actions).length > 0 &&
              <td style={{ backgroundColor: rowIndex % 2 == 0 ? "#f9f9f9" : "#fffef2" }}>
                <div className="flex flex-row">
                  {actions.map((action, index) => (
                    <Button key={index} variant={action.color} className="m-1 fs-6" onClick={() => action.action(item)} ><i className={action.icon}></i></Button>
                  ))}
                </div>
              </td>
            }
            </tr>
          ))}
        </tbody>
      </Table>
      {itens.length == 0 && 
        <Table striped bordered hover responsive="lg">
          <Alert variant="secondary"><b>Não há registros a serem exibidos</b></Alert>
        </Table>
      }
    </>
  );
}

export default TabelaListagem;
