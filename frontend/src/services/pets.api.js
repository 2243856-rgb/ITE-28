import api, { getApiErrorMessage } from "./api";

export async function fetchPets() {
    try {
        const res = await api.get("/pets");
        return { ok: true, items: res.data.data.items || [] };
    } catch (e) {
        return { ok: false, message: getApiErrorMessage(e), items: [] };
    }
}

export async function createPetRequest(body) {
    try {
        const res = await api.post("/pets", body);
        return { ok: true, pet: res.data.data };
    } catch (e) {
        return { ok: false, message: getApiErrorMessage(e, "Could not add pet") };
    }
}
