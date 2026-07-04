import { createContext, useState, useEffect, useContext } from 'react';
import apiClient from '../services/apiClient';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Comprobar si hay token al cargar la app
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('giftly_token');
      if (token) {
        try {
          // El interceptor añadirá el token a esta petición
          const res = await apiClient.get('/auth/me');
          setUser(res.data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Error al autenticar token existente", error);
          localStorage.removeItem('giftly_token');
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await apiClient.post('/auth/login', { email, password });
    const { token, user } = res.data;
    localStorage.setItem('giftly_token', token);
    setUser(user);
    setIsAuthenticated(true);
    return res.data;
  };

  const register = async (nombre, email, password) => {
    const res = await apiClient.post('/auth/register', { nombre, email, password });
    const { token, user } = res.data;
    localStorage.setItem('giftly_token', token);
    setUser(user);
    setIsAuthenticated(true);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('giftly_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
