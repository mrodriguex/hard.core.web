import axios from "axios";

const API = "https://hardcoreapi.hookhub.app";

const apiClient = axios.create({
  baseURL: API,
  headers: { "Content-Type": "application/json" },
});

export async function login(username, password) {
  try {
    const response = await apiClient.post("/api/v1/Auth/login", {
      username,
      password,
    });

    // The API always returns HTTP 200 with an envelope:
    // { success: bool, data: <token|null>, message: string, errors: [] }
    const { success, data, message } = response.data;

    if (!success) {
      return { success: false, message: message || "Error al iniciar sesión." };
    }

    // Token is in the `data` field (string JWT or object with .token)
    const token = typeof data === "string" ? data : data?.token ?? null;

    if (!token) {
      return { success: false, message: "No se recibió un token de autenticación." };
    }

    localStorage.setItem("token", token);
    return { success: true, token };
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Error al iniciar sesión.";
    return { success: false, message: String(message) };
  }
}

export function logout() {
  localStorage.removeItem("token");
}

export function getToken() {
  return localStorage.getItem("token");
}

export function isAuthenticated() {
  return Boolean(getToken());
}