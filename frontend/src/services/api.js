import axios from "axios";
import { API_BASE_URL } from "../config/env";
import { getMemoryToken } from "./authSession";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = getMemoryToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const msg = error.response?.data?.error?.message || error.message;
        // eslint-disable-next-line no-console
        console.error("API:", msg, error.response?.data);
        return Promise.reject(error);
    }
);

export function getApiErrorMessage(error, fallback = "Request failed") {
    return error?.response?.data?.error?.message || fallback;
}

export default api;
