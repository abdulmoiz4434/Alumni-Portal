import API from './axios';

export const loginUser = async (credentials) => {
    try {
        const response = await API.post('/auth/login', credentials);
        
        // If login successful, save token to LocalStorage
        if (response.data.success) {
            localStorage.setItem('token', response.data.data.token);
        }
        
        return response.data;
    } catch (error) {
        // This grabs the error message you wrote in your backend errorResponse
        throw error.response?.data?.message || 'Login failed';
    }
};