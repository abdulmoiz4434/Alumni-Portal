import axios from "axios";

const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (window.location.hostname === "localhost") return "http://localhost:5000/api";
  return "https://alumni-portal-backend-two.vercel.app/api";
};

const API = axios.create({
  baseURL: getBaseURL(),
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
