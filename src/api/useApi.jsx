import axios from 'axios';
import { getSessionCookie } from '../helpers/cookies';

const api = axios.create({
    baseURL: process.env.REACT_APP_API
});

export const useApi = () => ({
    validateToken: async (token) => {
        try {
            const response = await api.post('/validate', { token });
            return {
                user: {username : response.data.username, email: response.data.email}
            };
        } catch (error) {
            return error
        }
    },
    signin: async (email, senha) => {
        try {
            const response = await api.post('/login', { email, senha })
            .then((result) => {
                return result
            })
            .catch((error) => {
                return error
            })
            
            return response;
        } catch (error) {
            return error            
        }
    },
    logout: async () => {
        return { status: true };
        const response = await api.post('/logout');
        return response.data;
    },
    get: async (path) => {
        try {
            const response = await api.get(path, {
                headers: {
                    Authorization: `Bearer ${getSessionCookie()?.token}`
                }
            });
            return response;
        } catch (error) {
            return error;
        }
    },
    post: async (path, data) => {
        try {
            const response = await api.post(path, data, {
                headers: {
                    Authorization: `Bearer ${getSessionCookie()?.token}`
                }
            })
            .then((result) => {
                return result
            })
            .catch((error) => {
                return error
            })

            return response;
        } catch (error) {
            return error
        }
    },
    delete: async (path, id) => {
        try {
            const response = await api.delete(`${path}/${id}`, {
                headers: {
                    Authorization: `Bearer ${getSessionCookie()?.token}`
                }
            })
            .then((result) => {
                return result
            })
            .catch((error) => {
                return error
            })

            return response;
        } catch (error) {
            return error
        }
    },
    put: async (path, data) => {
        try {
            const response = await api.put(path, data, {
                headers: {
                    Authorization: `Bearer ${getSessionCookie()?.token}`
                }
            })
            .then((result) => {
                return result
            })
            .catch((error) => {
                return error
            })
    
            return response;
        } catch (error) {
            return error
        }
    },
});