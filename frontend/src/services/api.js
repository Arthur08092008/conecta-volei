import axios from 'axios';

const api = axios.create({
  //baseURL: 'http://localhost:3000',
  baseURL:
    import.meta.env.VITE_API_URL ||
    (import.meta.env.DEV ? 'http://localhost:3000' : '/api'),
});

// Anexa o token JWT salvo no login em toda requisicao, quando existir
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('voleitcc_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
