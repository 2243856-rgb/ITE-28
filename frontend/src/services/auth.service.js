import api from "./api";

function pickMessage(error) {
  const body = error.response?.data;
  if (body?.error?.message) return body.error.message;
  if (body?.message) return body.message;
  return error.message;
}

export const AuthService = {
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  /**
   * Persists owner to Azure SQL via backend POST /auth/register-owner
   * (fullName + email + password required; phoneNumber optional)
   */
  registerOwner: async ({ fullName, email, phoneNumber, password }) => {
    const response = await api.post("/auth/register-owner", {
      fullName,
      email,
      phoneNumber: phoneNumber || undefined,
      password
    });
    return response.data;
  },

  pickMessage
};
