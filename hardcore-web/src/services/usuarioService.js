import axios from "axios";
import { getToken } from "./authService";

const API = "https://hardcoreapi.hookhub.app";

const apiClient = axios.create({ baseURL: API });

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

function unwrap(response) {
  const { success, data, message } = response.data;
  if (!success) throw new Error(message || "Error en la operación.");
  return data;
}

/** GET /api/v1/Usuario/GetAll */
export async function getAll({ activo, pageIndex = 1, pageSize = 10 } = {}) {
  const params = { pageIndex, pageSize };
  if (activo !== undefined) params.activo = activo;
  const res = await apiClient.get("/api/v1/Usuario/GetAll", { params });
  return unwrap(res);
}

/** GET /api/v1/Usuario/GetById?idUsuario= */
export async function getById(idUsuario) {
  const res = await apiClient.get("/api/v1/Usuario/GetById", { params: { idUsuario } });
  return unwrap(res);
}

/** GET /api/v1/Usuario/Exists?idUsuario= */
export async function exists(idUsuario) {
  const res = await apiClient.get("/api/v1/Usuario/Exists", { params: { idUsuario } });
  return unwrap(res);
}

/** POST /api/v1/Usuario/Add */
export async function add(usuario) {
  const res = await apiClient.post("/api/v1/Usuario/Add", usuario);
  return unwrap(res);
}

/** PUT /api/v1/Usuario/Update */
export async function update(usuario) {
  const res = await apiClient.put("/api/v1/Usuario/Update", usuario);
  return unwrap(res);
}

/** DELETE /api/v1/Usuario/Delete?idUsuario= */
export async function remove(idUsuario) {
  const res = await apiClient.delete("/api/v1/Usuario/Delete", { params: { idUsuario } });
  return unwrap(res);
}

/** PUT /api/v1/Usuario/UnlockUser  body: idUsuario (int) */
export async function unlockUser(idUsuario) {
  const res = await apiClient.put("/api/v1/Usuario/UnlockUser", idUsuario);
  return unwrap(res);
}

/** PUT /api/v1/Usuario/UpdatePassword  body: LoginModel */
export async function updatePassword(username, password) {
  const res = await apiClient.put("/api/v1/Usuario/UpdatePassword", { username, password });
  return unwrap(res);
}
