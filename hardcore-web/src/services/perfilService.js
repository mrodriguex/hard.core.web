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

/** GET /api/v1/Perfil/GetAll */
export async function getAll({ activo, pageIndex = 1, pageSize = 10 } = {}) {
  const params = { pageIndex, pageSize };
  if (activo !== undefined) params.activo = activo;
  const res = await apiClient.get("/api/v1/Perfil/GetAll", { params });
  return unwrap(res);
}

/** GET /api/v1/Perfil/GetById?idPerfil= */
export async function getById(idPerfil) {
  const res = await apiClient.get("/api/v1/Perfil/GetById", { params: { idPerfil } });
  return unwrap(res);
}

/** POST /api/v1/Perfil/Add */
export async function add(perfil) {
  const res = await apiClient.post("/api/v1/Perfil/Add", perfil);
  return unwrap(res);
}

/** PUT /api/v1/Perfil/Update */
export async function update(perfil) {
  const res = await apiClient.put("/api/v1/Perfil/Update", perfil);
  return unwrap(res);
}

/** DELETE /api/v1/Perfil/Delete?idPerfil= */
export async function remove(idPerfil) {
  const res = await apiClient.delete("/api/v1/Perfil/Delete", { params: { idPerfil } });
  return unwrap(res);
}

/** GET /api/v1/Perfil/GetUserProfiles?idUsuario= */
export async function getUserProfiles(idUsuario) {
  const res = await apiClient.get("/api/v1/Perfil/GetUserProfiles", { params: { idUsuario } });
  return unwrap(res);
}
