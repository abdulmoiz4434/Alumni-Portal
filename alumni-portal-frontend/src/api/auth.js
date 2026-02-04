import API from './axios';

export const loginUser = async (email, password, role) => {
    try {
        const response = await API.post('/auth/login', { email, password, role });

        if (response.data.success && response.data.data) {
            const { token, user } = response.data.data;
            
            if (token) {
                localStorage.setItem('token', token);
            }
            return response.data.data; 
        }
        return null;
    } catch (error) {
        throw error.response?.data?.message || 'Login failed';
    }
};