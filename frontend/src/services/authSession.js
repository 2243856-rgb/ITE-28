import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "nestvet_access_token";

/** In-memory token for axios (sync); persisted via AsyncStorage */
let memoryToken = null;

export function getMemoryToken() {
    return memoryToken;
}

export function setMemoryToken(token) {
    memoryToken = token || null;
}

export async function persistAccessToken(token) {
    setMemoryToken(token);
    if (token) {
        await AsyncStorage.setItem(STORAGE_KEY, token);
    } else {
        await AsyncStorage.removeItem(STORAGE_KEY);
    }
}

export async function clearAccessToken() {
    setMemoryToken(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
}

export async function loadStoredAccessToken() {
    const t = await AsyncStorage.getItem(STORAGE_KEY);
    setMemoryToken(t);
    return t;
}
