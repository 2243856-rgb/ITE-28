import api from './api';

export const AuthService = {
    login: async (email, password) => {
        try {
            console.log('/// ATTEMPTING SERVER LOGIN ///');
            const response = await api.post('/auth/login', { email, password });
            return response.data;
        } catch (error) {
            console.error('LOGIN FAILED:', error.response?.data?.message || error.message);
            throw error;
        }
    },

    register: async (email, password) => {
        try {
            console.log('/// INITIALIZING NEW SAVE FILE ///');
            const response = await api.post('/auth/register', { email, password });
            return response.data;
        } catch (error) {
            console.error('REGISTRATION FAILED:', error.response?.data?.message || error.message);
            throw error;
        }
    }
};