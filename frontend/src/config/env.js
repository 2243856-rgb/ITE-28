/**
 * API base URL (no trailing slash).
 * Set `EXPO_PUBLIC_API_URL` in `.env` for local backend, e.g. `http://192.168.1.5:4001/api/v1`
 */
const trim = (s) => String(s || "").replace(/\/+$/, "");

/** Ensures calls hit NestVet routes under `/api/v1` (common misconfig: secret is app root only). */
export function normalizeNestvetApiBase(url) {
    const s = trim(url);
    if (!s) return "";
    if (s.endsWith("/api/v1")) return s;
    return `${s}/api/v1`;
}

const fromEnv =
    typeof process !== "undefined" &&
    process.env &&
    process.env.EXPO_PUBLIC_API_URL
        ? normalizeNestvetApiBase(trim(process.env.EXPO_PUBLIC_API_URL))
        : "";

const defaultHosted =
    "https://nestvetapplication-e2a0bzagaka3bhfq.eastasia-01.azurewebsites.net/api/v1";

export const API_BASE_URL = fromEnv || normalizeNestvetApiBase(defaultHosted);

/** Single-clinic MVP — matches backend expectations */
export const DEFAULT_CLINIC_ID = "main-clinic";
