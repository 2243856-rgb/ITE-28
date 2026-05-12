import axios from 'axios';

// This is your official Azure Backend URL
const AZURE_BACKEND_URL = 'https://nestvetapplication-e2a0bzagaka3bhfq.eastasia-01.azurewebsites.net/api/v1';

const api = axios.create({
    baseURL: AZURE_BACKEND_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    // This allows your frontend to send and receive cookies (important for Login/Auth)
    withCredentials: true 
});

// Optional: Add a simple interceptor to log errors for easier debugging in the browser console
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response ? error.response.data : error.message);
        return Promise.reject(error);
    }
);

export default api;
