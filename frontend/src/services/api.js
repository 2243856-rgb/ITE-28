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
    const apiMsg = error?.response?.data?.error?.message;
    if (apiMsg) return apiMsg;

    const status = error?.response?.status;
    if (status) {
        const body = error?.response?.data;
        const code = body?.error?.code;
        const extra = code ? ` (${code})` : "";
        return `Request failed (${status})${extra}. Check the API URL and server logs.`;
    }

    if (
        error?.code === "ERR_NETWORK" ||
        error?.message === "Network Error"
    ) {
        return "Cannot reach the API. Check EXPO_PUBLIC_API_URL, CORS, and that the backend is running.";
    }

    return error?.message || fallback;
}

export default api;
