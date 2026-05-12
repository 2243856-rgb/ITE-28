import axios from 'axios';

const api = axios.create({
  baseURL: 'https://nestvetapplication-e2a0bzagaka3bhfq.eastasia-01.azurewebsites.net/api/v1'
});

const api = axios.create({
    baseURL: AZURE_BACKEND_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true 
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response ? error.response.data : error.message);
        return Promise.reject(error);
    }
);

export default api;
