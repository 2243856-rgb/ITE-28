import axios from 'axios';
import { Platform } from 'react-native';

// Make sure to include the /api/v1 at the end!
const API_URL = "https://nestvetapplication-e2a0bzagaka3bhfq.eastasia-01.azurewebsites.net/api/v1";

const api = axios.create({
    baseURL: SERVER_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
