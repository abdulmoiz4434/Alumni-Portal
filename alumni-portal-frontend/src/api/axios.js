import axios from 'axios';

// Create an Axios instance with production-ready baseURL
const instance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`, // dynamic URL for Render backend
  withCredentials: true, // needed if backend uses cookies for auth
});

// Automatically attach token from localStorage to all requests
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
