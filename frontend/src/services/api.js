import axios from 'axios';
import { Platform } from 'react-native';

const SERVER_URL = Platform.OS === 'android' ? https://nestvetapplication-e2a0bzagaka3bhfq.eastasia-01.azurewebsites.net/api/v1

const api = axios.create({
    baseURL: SERVER_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
