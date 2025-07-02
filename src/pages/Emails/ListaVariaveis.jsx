// Bootstrap
import Row from "react-bootstrap/Row";
import Accordion from 'react-bootstrap/Accordion';

// Utils e helpers
import TabelaListagem from "../../components/TabelaListagem/TabelaListagem";

const ListaVariaveis = () => {
    const headers = [
        { value: "Palavra-Chave", objectValue: "variavel" },
        { value: "Descrição", objectValue: "descricao" },
    ]

    const listaVariaveis = [
        { variavel: "{NOME}", descricao: "Nome de Tratamento do Usuário" },
        { variavel: "{USUARIO}", descricao: "Nome de Usuário" },
        { variavel: "{SENHA}", descricao: "Senha do Usuário" },
        { variavel: "{URLWeb}", descricao: "Link do Sistema" },
        { variavel: "{URLApi}", descricao: "Link da API" },
        { variavel: "{MEDICAMENTO}", descricao: "Nome do Medicamento" },
        { variavel: "{DATARETORNO}", descricao: "Data de Retorno do Medicamento" },
        { variavel: "{RESULTADO}", descricao: "Resultado de Alguma Análise ou Processamento" },
        { variavel: "{ICONEMEDICAMENTO}", descricao: "Ícone de Comprimido 💊" },
        { variavel: "{ICONECALENDARIO}", descricao: "Ícone de Calendário 📆" },
    ]

    return (
        <Accordion defaultActiveKey="1">
            <Accordion.Item eventKey="0">
                <Accordion.Header><b>Palavras-Chave</b></Accordion.Header>
                <Accordion.Body>
                    <Row className="filtros">
                        <TabelaListagem headers={headers} itens={listaVariaveis} />
                    </Row>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
};

export default ListaVariaveis;
