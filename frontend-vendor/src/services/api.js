import axios from 'axios';

const api = axios.create({
  // Uses VITE_API_URL in production (Vercel), falls back to the local backend in development
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true
});

// Automatically attach the token to every request if the user is logged in
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vendorToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;