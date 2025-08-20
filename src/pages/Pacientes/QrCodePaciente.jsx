import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom";

// Utils e helpers
import Loading from "../../components/Loading/Loading";
import { showMessage, showQuestion } from "../../helpers/message";
import { useApi } from "../../api/useApi";
import moment from "moment";
import FichaPaciente from "./FichaPaciente";
import { Form } from "react-bootstrap";


export default function QrCodePaciente() {
    const { hash } = useParams();
    const api = useApi();
    const [loading, setLoading] = useState(false);
    const [dadosPaciente, setDadosPaciente] = useState([]);
    const [dadosUsuario, setDadosUsuarios] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                await api.get(`/Pacientes/getByHash/${hash}`).then((result) => {
                    setDadosPaciente(result.data);
                    setLoading(false);
                });
            } catch (error) {
                showMessage("Aviso", "Erro ao buscar dados: " + error, "error", null);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                await api.get(`/Usuarios/get/${dadosPaciente?.usuariosId}`).then((result) => {
                    setDadosUsuarios(result.data);
                    setLoading(false);
                });
            } catch (error) {
                showMessage("Aviso", "Erro ao buscar dados: " + error, "error", null);
                setLoading(false);
            }
        };

        fetchData();
    }, [dadosPaciente]);
    
    return (
        <>
            {dadosUsuario &&
                <Form className="text-black mb-4 shadow p-3 mb-5 bg-white rounded">
                    <FichaPaciente dados={dadosUsuario} handleReturn={null} />
                </Form>
            }
        </>
    )
}