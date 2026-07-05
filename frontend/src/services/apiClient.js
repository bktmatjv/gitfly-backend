import axios from 'axios';

// Vite proxy redirige '/api' a Nginx (y de ahí al backend)
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para inyectar el token en cada petición
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('giftly_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar respuestas, por ejemplo, si el token expira (401)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Manejar la expiración del token limpiando el storage
      localStorage.removeItem('giftly_token');
      // Redirigir al login opcionalmente
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
