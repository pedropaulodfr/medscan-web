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
import { ValidaCampos } from "../../helpers/validacoes";
import { useApi } from "../../api/useApi";
import moment from "moment";
import { InputCEP, InputCPF } from "../../helpers/mask";
import { getSessionCookie } from "../../helpers/cookies";

const AddPacientes = ({ handleReturn, dadosEdicao = [] }) => {
  const api = useApi();
  const [dadosPaciente, setDadosPaciente] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Campos a serem validados
  const campos = [
    { nome: "nome", type: "text" },
    { nome: "nomeCompleto", type: "text" },
    { nome: "cpf", type: "text" },
    { nome: "email", type: "text" },
    { nome: "dataNascimento", type: "text" },
    { nome: "logradouro", type: "text" },
    { nome: "numero", type: "text" },
    { nome: "bairro", type: "text" },
    { nome: "cidade", type: "text" },
    { nome: "uf", type: "text" },
    { nome: "cep", type: "text" },
  ];

  // Estado dos campos de senha
  const [novaSenha, setNovaSenha] = useState("")
  const [confirmarSenha, setConfirmarSenha] = useState("")

  const onBlurCep = (event) => {
    try {
      setLoading(true);
      api.get(`/Cep/getEndereco/${event.target.value}`).then((result) => {
        setDadosPaciente({
          ...dadosPaciente,
          logradouro: result.data?.logradouro,
          numero: result.data?.numero,
          complemento: result.data?.complemento,
          bairro: result.data?.bairro,
          cidade: result.data?.localidade,
          uf: result.data?.uf,
          cep: result.data?.cep,
        });
        setLoading(false);
      });
    } catch (error) {
      showMessage("Aviso", "Erro ao buscar dados: " + error, "error", null);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (Object.keys(dadosEdicao).length > 0) {
        setDadosPaciente({
            ...dadosPaciente,
            id: dadosEdicao.id,
            nome: dadosEdicao.nome,
            nomeCompleto: dadosEdicao.nomeCompleto,
            cpf: dadosEdicao.cpf,
            email: dadosEdicao.email,
            dataNascimento: moment(dadosEdicao.dataNascimento).format("YYYY-MM-DD") ,
            logradouro: dadosEdicao.logradouro,
            numero: dadosEdicao.numero,
            complemento: dadosEdicao.complemento,
            bairro: dadosEdicao.bairro,
            cidade: dadosEdicao.cidade,
            uf: dadosEdicao.uf,
            cep: dadosEdicao.cep,
            cns: dadosEdicao.cns,
            planoSaude: dadosEdicao.planoSaude,
            usuariosId: dadosEdicao.usuarios.id,
        });
    }
}, []);

  const handleDadosPacienteChange = (event, campo) => {
    setDadosPaciente({
      ...dadosPaciente,
      [campo]: event.target.value,
    });
  };

  const handleLimparCampos = () => {
    setDadosPaciente({nome: "", nomeCompleto: "", cpf: "", email: "", dataNascimento: "", logradouro: "", numero: "", complemento: "",
      bairro: "", cidade: "", uf: "", cep: "", cns: "", planoSaude: "", });
  };

  const onSubmit = () => {
    const newErrors = ValidaCampos(campos, dadosPaciente);
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors); // Atualiza o estado de erros
      return; // Interrompe a execução
    }

    if (Object.keys(dadosEdicao).length == 0) {
      setLoading(true);
      api.post("/Pacientes/insert", dadosPaciente)
        .then((result) => {
          if (result.status !== 200)
            throw new Error(result?.response?.data?.message);

          showMessage("Sucesso", "Paciente cadastrado com sucesso!", "success", null);
          setLoading(false);
          handleLimparCampos();
        })
        .catch((err) => {
          showMessage("Erro", err, "error", null);
          setLoading(false);
        });
    } else {
      var objPaciente = dadosPaciente;
      if (dadosEdicao.usuarios.perfil == "Paciente" && novaSenha === confirmarSenha) {
        objPaciente = {
          ...dadosPaciente,
          usuarios: {
            id: dadosEdicao.usuarios.id,
            perfil: dadosEdicao.usuarios.perfil,
            nome: dadosEdicao.usuarios.nome,
            email: dadosEdicao.usuarios.email,
            senha: novaSenha,
            ativo: dadosEdicao.usuarios.ativo,
            imagemPerfil: dadosEdicao.usuarios.imagemPerfil,
            codigoCadastro: dadosEdicao.usuarios.codigoCadastro,
          }
        }
      } else if (dadosEdicao.usuarios.perfil == "Paciente" && novaSenha != "" && confirmarSenha == "") {
        setErrors({confirmarSenha: true})
        return
      } else if (dadosEdicao.usuarios.perfil == "Paciente" && novaSenha == "" && confirmarSenha != "") {  
        setErrors({novaSenha: true})
        return
      } else if (dadosEdicao.usuarios.perfil == "Paciente" && novaSenha !== confirmarSenha) {
        setErrors({novaSenha: true, confirmarSenha: true})
        return
      }

      setLoading(true);
      api.put("/Pacientes/update", objPaciente)
        .then((result) => {
          if (result.status !== 200)
            throw new Error(result?.response?.data?.message);

          showMessage(
            "Sucesso",
            "Paciente editado com sucesso!",
            "success",
            () => {
              handleReturn();
            }
          );
          setLoading(false);
          handleLimparCampos();
        })
        .catch((err) => {
          showMessage("Erro", err, "error", null);
          setLoading(false);
        });
    }
  };

  return (
    <Container>
      {loading && <Loading />}
      <Row>
        <Col>
          <Button
            className="mb-5 mt-2 text-white"
            variant="secondary"
            onClick={handleReturn}
          >
            <i className="bi bi-arrow-left"></i> Voltar
          </Button>{" "}
        </Col>
      </Row>
      <Row>
        <Col md>
          <h4>
            {Object.keys(dadosEdicao).length == 0 ? "Cadastrar" : "Editar"}
          </h4>
        </Col>
      </Row>
      <Row className="filtros">
        <Col md="4">
          <Form.Group className="mb-3">
            <Form.Label><span className="text-danger">*</span> Nome</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nome"
              value={dadosPaciente?.nome}
              onChange={(e) => handleDadosPacienteChange(e, "nome")}
              isInvalid={!!errors.nome}
            />
          </Form.Group>
        </Col>
        <Col md="4">
          <Form.Group className="mb-3">
            <Form.Label><span className="text-danger">*</span> Nome Completo</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nome Completo"
              value={dadosPaciente?.nomeCompleto}
              onChange={(e) => handleDadosPacienteChange(e, "nomeCompleto")}
              isInvalid={!!errors.nomeCompleto}
            />
          </Form.Group>
        </Col>
        <Col md="4">
          <Form.Group className="mb-3">
            <Form.Label><span className="text-danger">*</span> CPF</Form.Label>
            <InputCPF 
              type="text"
              placeholder="CPF"
              value={dadosPaciente?.cpf}
              onChange={(e) => handleDadosPacienteChange(e, "cpf")}
              isInvalid={!!errors.cpf}
              disabled={dadosEdicao?.perfil == "Paciente"}
            />
          </Form.Group>
        </Col>
        <Col md="4">
          <Form.Group className="mb-3">
            <Form.Label><span className="text-danger">*</span> E-mail</Form.Label>
            <Form.Control
              type="text"
              placeholder="usuario@exemplo.com"
              value={dadosPaciente?.email}
              onChange={(e) => handleDadosPacienteChange(e, "email")}
              isInvalid={!!errors.email}
            />
          </Form.Group>
        </Col>
        <Col md="4">
        <Form.Group controlId="date" bsSize="large">
            <Form.Label><span className="text-danger">*</span> Data de Nascimento</Form.Label>
            <Form.Control
              type="date"
              style={{ width: "100%" }}
              value={dadosPaciente?.dataNascimento}
              onChange={(e) => handleDadosPacienteChange(e, "dataNascimento")}
              isInvalid={!!errors.dataNascimento}
            />
          </Form.Group>
        </Col>
        <Col md="4">
          <Form.Group className="mb-3">
            <Form.Label>Plano de Saúde</Form.Label>
            <Form.Control
              type="text"
              placeholder="Plano"
              value={dadosPaciente?.planoSaude}
              onChange={(e) => handleDadosPacienteChange(e, "planoSaude")}
              isInvalid={!!errors.planoSaude}
            />
          </Form.Group>
        </Col>
        <Col md="4">
          <Form.Group className="mb-3">
            <Form.Label>CNS</Form.Label>
            <Form.Control
              type="text"
              placeholder="CNS"
              value={dadosPaciente?.cns}
              onChange={(e) => handleDadosPacienteChange(e, "cns")}
              isInvalid={!!errors.cns}
            />
          </Form.Group>
        </Col>
        <Col md="4">
          <Form.Group className="mb-3">
            <Form.Label><span className="text-danger">*</span> CEP</Form.Label>
            <InputCEP 
              type="text"
              placeholder="CEP"
              value={dadosPaciente?.cep}
              onChange={(e) => handleDadosPacienteChange(e, "cep")}
              onBlur={onBlurCep}
              isInvalid={!!errors.cep}
            />
          </Form.Group>
        </Col>
        <Col md="4">
          <Form.Group className="mb-3">
            <Form.Label><span className="text-danger">*</span> Logradouro</Form.Label>
            <Form.Control
              type="text"
              placeholder="Logradouro"
              value={dadosPaciente?.logradouro}
              onChange={(e) => handleDadosPacienteChange(e, "logradouro")}
              isInvalid={!!errors.logradouro}
            />
          </Form.Group>
        </Col>
        <Col md="4">
          <Form.Group className="mb-3">
            <Form.Label><span className="text-danger">*</span> Numero</Form.Label>
            <Form.Control
              type="text"
              placeholder="Numero"
              value={dadosPaciente?.numero}
              onChange={(e) => handleDadosPacienteChange(e, "numero")}
              isInvalid={!!errors.numero}
            />
          </Form.Group>
        </Col>
        <Col md="4">
          <Form.Group className="mb-3">
            <Form.Label>Complemento</Form.Label>
            <Form.Control
              type="text"
              placeholder="Complemento"
              value={dadosPaciente?.complemento}
              onChange={(e) => handleDadosPacienteChange(e, "complemento")}
              isInvalid={!!errors.complemento}
            />
          </Form.Group>
        </Col>
        <Col md="4">
          <Form.Group className="mb-3">
            <Form.Label><span className="text-danger">*</span> Bairro</Form.Label>
            <Form.Control
              type="text"
              placeholder="Bairro"
              value={dadosPaciente?.bairro}
              onChange={(e) => handleDadosPacienteChange(e, "bairro")}
              isInvalid={!!errors.bairro}
            />
          </Form.Group>
        </Col>
        <Col md="4">
          <Form.Group className="mb-3">
            <Form.Label><span className="text-danger">*</span> Cidade</Form.Label>
            <Form.Control
              type="text"
              placeholder="Cidade"
              value={dadosPaciente?.cidade}
              onChange={(e) => handleDadosPacienteChange(e, "cidade")}
              isInvalid={!!errors.cidade}
            />
          </Form.Group>
        </Col>
        <Col md="4">
          <Form.Group className="mb-3">
            <Form.Label><span className="text-danger">*</span> UF</Form.Label>
            <Form.Control
              type="text"
              placeholder="UF"
              maxLength={2}
              value={dadosPaciente?.uf}
              onChange={(e) => handleDadosPacienteChange(e, "uf")}
              isInvalid={!!errors.uf}
            />
          </Form.Group>
        </Col>
      </Row>
      {getSessionCookie()?.perfil == "Paciente" &&
        <Row>
        <hr className="text-black d-none d-sm-block m-2" />
        <span className="fw-bold mb-2">Senha de Acesso</span>
        <Col md="4">
            <Form.Group className="mb-3">
              <Form.Label><span className="text-danger">*</span> Nova Senha</Form.Label>
              <Form.Control
                type="password"
                placeholder="Nova Senha"
                autoComplete="off"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                isInvalid={!!errors.novaSenha}
              />
            </Form.Group>
          </Col>
          <Col md="4">
            <Form.Group className="mb-3">
              <Form.Label><span className="text-danger">*</span> Confirmar Senha</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirmar Senha"
                autoComplete="off"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                isInvalid={!!errors.confirmarSenha}
              />
            </Form.Group>
          </Col>
        </Row>
      }
      <Row>
        <Col>
          <Button
            className="m-3 mb-0 mt-2 text-white"
            variant="info"
            style={{ backgroundColor: "#3F8576", borderColor: "#3F8576" }}
            onClick={onSubmit}
          >
            <i className="bi bi-plus"></i> Salvar
          </Button>{" "}
          {Object.keys(dadosPaciente).length > 0 && (
            <>
              <Button
                className="m-3 mb-0 mt-2 text-white"
                variant="info"
                style={{ backgroundColor: "#50BF84", borderColor: "#50BF84" }}
                onClick={handleLimparCampos}
              >
                <i className="bi bi-eraser"></i> Limpar Campos
              </Button>{" "}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default AddPacientes;
