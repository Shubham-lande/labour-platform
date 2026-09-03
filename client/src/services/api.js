import axios from 'axios';

// Detect production API URL or fallback to same-origin relative '/api'
const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('labour_platform_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global Handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('[API Auth]: Unauthorized request (401). Clearing local session token.');
      localStorage.removeItem('labour_platform_token');
      localStorage.removeItem('labour_platform_user');
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'API request failed. Please check your network and server connection.';

    return Promise.reject(new Error(message));
  }
);

export default api;
