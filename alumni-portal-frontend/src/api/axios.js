import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5000/api', // Your backend URL
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