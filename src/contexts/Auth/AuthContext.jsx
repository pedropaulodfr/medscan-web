import React, { createContext, useState, useContext, useEffect } from "react";
import { useApi } from "../../api/useApi";
import { getSessionCookie, setSessionCookie } from "../../helpers/cookies";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const storageData = getSessionCookie()?.token;
    return !!storageData; // Definir isLoggedIn com base na presença do token no localStorage
  });

  const api = useApi();

  useEffect(() => {
    const validateToken = async () => {
      //const storageData = localStorage.getItem("authToken");
      if (getSessionCookie()?.token) {
        const data = await api.validateToken(getSessionCookie()?.token);
        if (data.user) {
          setIsLoggedIn(true);
        } else {
          logout()
        }
      }
    };
    validateToken();
  }, []);

  const login = async (email, senha) => {
    const response = await api.signin(email, senha)
      .then((result) => {
        return result;
      })
      .catch((error) => {
        return error;
      });
      
      if (response.data?.usuario_Id && response.data?.token) {
        setToken(response.data)
        setIsLoggedIn(true)
        return { success: true, statusCode: response.status }
      }
    setIsLoggedIn(false)
    return { success: false, statusCode: 500 }
  };
  

  const logout = async () => {
    setToken("");
    setSessionCookie(null)
    await api.logout();
    setIsLoggedIn(false);
  };

  const setToken = (data) => {
    setSessionCookie(data)
    //localStorage.setItem('authToken', data.token);
};

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
