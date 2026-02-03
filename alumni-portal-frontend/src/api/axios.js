import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://alumni-portal-backend-two.vercel.app/api', // Deployed backend URL
});

// This interceptor automatically attaches the Token to every request
instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default instance;