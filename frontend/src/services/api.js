import axios from "axios";
import { Platform } from "react-native";

/**
 * Local dev: Android emulator uses 10.0.2.2 to reach the host machine.
 * iOS simulator: localhost. Physical device: set your PC's LAN IP.
 * Production: deployed API (include /api/v1).
 */
const API_BASE_URL = __DEV__
  ? Platform.select({
      android: "http://10.0.2.2:4001/api/v1",
      ios: "http://localhost:4001/api/v1",
      default: "http://localhost:4001/api/v1"
    })
  : "https://nestvetapplication-e2a0bzagaka3bhfq.eastasia-01.azurewebsites.net/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 30000
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response ? error.response.data : error.message);
    return Promise.reject(error);
  }
);

export default api;
