import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "nestvet_access_token";

/** In-memory token for axios (sync); persisted per platform */
let memoryToken = null;

function webSessionGet() {
    try {
        if (typeof globalThis === "undefined" || !globalThis.sessionStorage) {
            return null;
        }
        return globalThis.sessionStorage.getItem(STORAGE_KEY);
    } catch {
        return null;
    }
}

function webSessionSet(token) {
    try {
        if (typeof globalThis === "undefined" || !globalThis.sessionStorage) {
            return;
        }
        if (token) {
            globalThis.sessionStorage.setItem(STORAGE_KEY, token);
        } else {
            globalThis.sessionStorage.removeItem(STORAGE_KEY);
        }
    } catch {
        // ignore (private mode, SSR)
    }
}

/** Older web builds stored JWT in AsyncStorage (localStorage); remove so sessions are not revived. */
async function clearLegacyWebAsyncStorageToken() {
    if (Platform.OS !== "web") return;
    try {
        await AsyncStorage.removeItem(STORAGE_KEY);
    } catch {
        // ignore
    }
}

export function getMemoryToken() {
    return memoryToken;
}

export function setMemoryToken(token) {
    memoryToken = token || null;
}

export async function persistAccessToken(token) {
    setMemoryToken(token);
    if (Platform.OS === "web") {
        webSessionSet(token || null);
        return;
    }
    if (token) {
        await AsyncStorage.setItem(STORAGE_KEY, token);
    } else {
        await AsyncStorage.removeItem(STORAGE_KEY);
    }
}

export async function clearAccessToken() {
    setMemoryToken(null);
    if (Platform.OS === "web") {
        webSessionSet(null);
        await clearLegacyWebAsyncStorageToken();
        return;
    }
    await AsyncStorage.removeItem(STORAGE_KEY);
}

export async function loadStoredAccessToken() {
    if (Platform.OS === "web") {
        await clearLegacyWebAsyncStorageToken();
        const t = webSessionGet();
        setMemoryToken(t);
        return t;
    }
    const t = await AsyncStorage.getItem(STORAGE_KEY);
    setMemoryToken(t);
    return t;
}
