/**
 * API base URL (no trailing slash).
 * Set `EXPO_PUBLIC_API_URL` in `.env` for local backend, e.g. `http://192.168.1.5:4001/api/v1`
 */
const trim = (s) => String(s || "").replace(/\/+$/, "");

const fromEnv =
    typeof process !== "undefined" &&
    process.env &&
    process.env.EXPO_PUBLIC_API_URL
        ? trim(process.env.EXPO_PUBLIC_API_URL)
        : "";

export const API_BASE_URL =
    fromEnv ||
    trim(
        "https://nestvetapplication-e2a0bzagaka3bhfq.eastasia-01.azurewebsites.net/api/v1"
    );

/** Single-clinic MVP — matches backend expectations */
export const DEFAULT_CLINIC_ID = "main-clinic";
