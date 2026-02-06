import API from './axios';
export const loginUser = async (email, password, role) => {
    return await API.post('/auth/login', { email, password, role });
};