import axios from "axios";
import { API_BASE_URL, normalizeNestvetApiBase } from "../config/env";
import { getMemoryToken } from "./authSession";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    // Do not use credentials for cross-origin calls to Azure App Service; it breaks
    // CORS from Static Web Apps (*.azurestaticapps.net). Auth uses Bearer tokens only.
    withCredentials: false,
});

/** Set by CI inject step (runtime-config.js) on deployed web; secret EXPO_PUBLIC_API_URL. */
api.interceptors.request.use((config) => {
    try {
        const g = typeof globalThis !== "undefined" ? globalThis : undefined;
        const runtime =
            g &&
            typeof g.__NESTVET_API_BASE__ === "string" &&
            g.__NESTVET_API_BASE__.trim();
        if (runtime) {
            config.baseURL = normalizeNestvetApiBase(runtime);
        }
    } catch {
        // ignore
    }
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
        const base = error?.config?.baseURL || API_BASE_URL;
        const path = error?.config?.url || "";
        const tried =
            base && path
                ? `${String(base).replace(/\/+$/, "")}/${String(path).replace(/^\//, "")}`
                : base || "(unknown URL)";
        return (
            "Cannot reach the API (browser blocked the response or the server did not answer). " +
            `Attempted: ${tried}. ` +
            "Set GitHub secret EXPO_PUBLIC_API_URL to your App Service URL (with or without `/api/v1`; it is added if missing), redeploy, open `/runtime-config.js` on the site to verify, " +
            "and confirm the backend is running (Azure portal → Log stream). " +
            "If the URL is correct, check CORS and App Service networking."
        );
    }

    return error?.message || fallback;
}

export default api;
