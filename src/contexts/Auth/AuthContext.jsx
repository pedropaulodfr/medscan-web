import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { useApi } from "../../api/useApi";
import { getSessionCookie, setSessionCookie } from "../../helpers/cookies";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const storageData = getSessionCookie()?.token;
    return !!storageData; // Definir isLoggedIn com base na presença do token no localStorage
  });
  const [userAcesso, setUserAcesso] = useState([])

  const [setup, setSetup] = useState({}); // Dados do setup
  const [notificacoes, setNotificacoes] = useState({}); // Dados das notificações
  const api = useApi();

  useEffect(() => {
    const validateToken = async () => {
      if (getSessionCookie()?.token) {
        const data = await api.validateToken(getSessionCookie()?.token);
        if (data.user) {
          setIsLoggedIn(true);
          setUserAcesso(data.user);
          await loadSetup();
          await loadNotificacoesNaoLidas();
        } else {
          logout()
        }
      }
    };
    validateToken();
  }, []);

  const login = useCallback(async (email, senha) => {
    const response = await api.signin(email, senha)
      .then((result) => {
        return result;
      })
      .catch((error) => {
        return error;
      });
      
      if (response.data?.usuarioId && response.data?.token) {
        setToken(response.data)
        setUserAcesso(response.data)
        setIsLoggedIn(true)
        await loadSetup();
        return { success: true, statusCode: response.status }
      }
    setIsLoggedIn(false)
    return { success: false, statusCode: 500 }
  }, [setIsLoggedIn])
  

  const logout = async () => {
    setToken("");
    setSessionCookie(null)
    await api.logout();
    setIsLoggedIn(false);
  };

  const setToken = (data) => {
    setSessionCookie(data)
  };

  const loadSetup = async () => {
    await api.get(`/setup`)
      .then((result) => {
        setSetup(result.data);
      })
      .catch((error) => {
        return error;
      });
  }
  
  const loadNotificacoesNaoLidas = async () => {
    await api.get(`/Notificacoes/getAllNotificacoes`)
      .then((result) => {
        setNotificacoes(result.data.filter((notificacao) => notificacao.lido == false));
      })
      .catch((error) => {
        return error;
      });
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, setup, notificacoes, userAcesso }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext

export const useAuth = () => useContext(AuthContext);
