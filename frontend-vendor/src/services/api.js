import axios from 'axios';

const api = axios.create({
  // Pointing to Express backend port
  baseURL: 'http://localhost:5000/api', 
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