import api, { getApiErrorMessage } from "./api";

export async function loginRequest(email, password) {
    try {
        const res = await api.post("/auth/login", { email, password });
        return { ok: true, data: res.data.data };
    } catch (e) {
        return { ok: false, message: getApiErrorMessage(e, "Login failed") };
    }
}

export async function registerOwnerRequest(payload) {
    try {
        const res = await api.post("/auth/register-owner", payload);
        return { ok: true, data: res.data.data };
    } catch (e) {
        return { ok: false, message: getApiErrorMessage(e, "Registration failed") };
    }
}

export async function fetchMeRequest() {
    try {
        const res = await api.get("/auth/me");
        return { ok: true, user: res.data.data };
    } catch (e) {
        return { ok: false, message: getApiErrorMessage(e) };
    }
}
