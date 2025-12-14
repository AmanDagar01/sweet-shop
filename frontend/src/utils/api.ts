import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Point to your Python backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Automatically add the Token to every request if we have it
api.interceptors.request.use(
  (config) => {
    // We will store the token in localStorage with the key 'token'
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;