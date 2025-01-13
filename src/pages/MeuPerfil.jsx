import { useState, useEffect, useRef } from "react";
import moment from "moment";

// Bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";

// Utils e helpers
import Loading from "../components/Loading/Loading";
import { showMessage } from "../helpers/message";

// Importar Componentes
import { useApi } from "../api/useApi";
import { getSessionCookie } from "../helpers/cookies";
import FichaPaciente from "./Pacientes/FichaPaciente";
import AddPacientes from "./Pacientes/AddPacientes";
import FichaUsuario from "./Usuarios/FichaUsuario";
import AddUsuarios from "./Usuarios/AddUsuarios";

export default function MeuPerfil() {
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const [usuario, setUsuario] = useState([])
  const [isChangeFoto, setIsChangeFoto] = useState(false)
  const [isEditarCadastro, setIsEditarCadastro] = useState(false)
  const [atualizarRegistros, setAtuailzarRegistros] = useState(false)
  const fileInputRef = useRef(null);

  const handleChangeFoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Aciona o clique no input file
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Você pode fazer o upload da imagem aqui
      const reader = new FileReader();
      reader.onloadend = () => {
        setUsuario({
          ...usuario,
          imagemPerfil: reader.result.replace("data:image/jpeg;base64,", "").replace("data:image/jpg;base64,", "").replace("data:image/png;base64,", "")
        })
        setIsChangeFoto(true)
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReturn = () => {
    setIsEditarCadastro(false)
    setAtuailzarRegistros(true)
  }

  const onSubmitImagem = () => {
    let _usuario = {
      ...usuario,
      paciente: null
    }
    
    api.put("/Usuarios/updateImagem", _usuario)
      .then((result) => {
        if (result.status !== 200)
          throw new Error(result?.response?.data?.message);

        showMessage( "Sucesso", "Foto alterada com sucesso!", "success", null);
        setIsChangeFoto(false)
        setAtuailzarRegistros(true)
        setLoading(false);
      })
      .catch((err) => {
        showMessage("Erro", err, "error", null);
        setLoading(false);
      });
  };

  useEffect(() => {
    setAtuailzarRegistros(false)
    const fetchData = async () => {
      try {
        setLoading(true);
        api.get(`/Usuarios/get/${getSessionCookie().usuario_Id}`).then((result) => {
            if (result.data.perfil == "Paciente") {
              result.data.paciente.usuarios = result.data
            }
            setUsuario(result.data);
            setAtuailzarRegistros(true)
            setLoading(false);
          });
      } catch (error) {
        showMessage("Aviso", "Erro ao buscar dados: " + error, "error", null);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Container>
      {loading && <Loading />}
      <Row className="justify-content-md-center">
        <Col className="d-flex justify-content-center">
          <h1 className="title-page">Meu Perfil</h1>
        </Col>
      </Row>
      {!isEditarCadastro &&
        <>
          <Row className="text-black mb-4 shadow p-3 mb-5 bg-white rounded" style={{ borderRadius: "15px", padding: "20px" }} >
            <Col className="d-flex justify-content-center">
              <div>
                <div className="d-flex justify-content-center mb-2">
                  <span className="fs-2 fw-semibold">
                    {usuario?.nome}
                  </span>
                </div>
                <div className="image-container">
                  <Image className="profile-image" src={`data:image/jpg;base64, ${usuario?.imagemPerfil}`} roundedCircle />
                  <div className="overlay">
                    <span className="overlay-text" onClick={handleChangeFoto}>Alterar Foto</span>
                  </div>
                  <input type="file" accept=".jpg,.jpeg,.png" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileChange} />
                </div>
                {isChangeFoto &&
                  <div className="d-flex justify-content-center mb-2">
                    <Button
                      className="m-3 mb-0 mt-2 text-white"
                      variant="info"
                      style={{ backgroundColor: "#3F8576", borderColor: "#3F8576" }}
                      onClick={onSubmitImagem}
                    >
                      <i className="bi bi-plus"></i> Salvar
                    </Button>{" "}
                  </div>
                }
              </div>
            </Col>
          </Row>
          {usuario?.perfil == "Paciente" && <FichaPaciente dados={usuario} />}
          {usuario?.perfil == "Admin" && <FichaUsuario dados={usuario} />}
          <Row>
            <Col className="d-flex justify-content-center">
              <Button
                className="m-3 mb-0 mt-2 text-white"
                variant="warning"
                onClick={() => setIsEditarCadastro(true)}
              >
                <i className="bi bi-plus"></i> Editar
              </Button>{" "}
            </Col>
          </Row>
        </>
      }
      {isEditarCadastro && usuario?.perfil == "Paciente" &&
        <Form className="text-black mb-4 shadow p-3 mb-5 bg-white rounded">
          <AddPacientes handleReturn={handleReturn} dadosEdicao={usuario.paciente} />
        </Form>
      }
      {isEditarCadastro && usuario?.perfil == "Admin" &&
        <Form className="text-black mb-4 shadow p-3 mb-5 bg-white rounded">
         <AddUsuarios handleReturn={handleReturn} dadosEdicao={usuario} />
        </Form>
      }
    </Container>
  );
}
