import axios from 'axios';
import { Platform } from 'react-native';

const SERVER_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000/api' : 'http://localhost:4000/api';

const api = axios.create({
    baseURL: SERVER_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;