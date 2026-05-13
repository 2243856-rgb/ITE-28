import api, { getApiErrorMessage } from "./api";

export async function fetchAppointments() {
    try {
        const res = await api.get("/appointments");
        return { ok: true, items: res.data.data.items || [] };
    } catch (e) {
        return { ok: false, message: getApiErrorMessage(e), items: [] };
    }
}

export async function createAppointmentRequest(body) {
    try {
        const res = await api.post("/appointments", body);
        return { ok: true, appointment: res.data.data };
    } catch (e) {
        return { ok: false, message: getApiErrorMessage(e, "Could not book appointment") };
    }
}

export async function cancelAppointmentRequest(appointmentId) {
    try {
        await api.delete(`/appointments/${appointmentId}`);
        return { ok: true };
    } catch (e) {
        return { ok: false, message: getApiErrorMessage(e, "Could not cancel") };
    }
}
