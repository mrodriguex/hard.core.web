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

/** GET /api/v1/Menu/GetAll */
export async function getAll({ activo, pageIndex = 1, pageSize = 10 } = {}) {
  const params = { pageIndex, pageSize };
  if (activo !== undefined) params.activo = activo;
  const res = await apiClient.get("/api/v1/Menu/GetAll", { params });
  return unwrap(res);
}

/** GET /api/v1/Menu/GetById?idMenu= */
export async function getById(idMenu) {
  const res = await apiClient.get("/api/v1/Menu/GetById", { params: { idMenu } });
  return unwrap(res);
}

/** POST /api/v1/Menu/Add */
export async function add(menu) {
  const res = await apiClient.post("/api/v1/Menu/Add", menu);
  return unwrap(res);
}

/** PUT /api/v1/Menu/Update */
export async function update(menu) {
  const res = await apiClient.put("/api/v1/Menu/Update", menu);
  return unwrap(res);
}

/** DELETE /api/v1/Menu/Delete?idMenu= */
export async function remove(idMenu) {
  const res = await apiClient.delete("/api/v1/Menu/Delete", { params: { idMenu } });
  return unwrap(res);
}

/** GET /api/v1/Menu/GetMenusByUser?idUsuario=&idPerfil= */
export async function getMenusByUser(idUsuario, idPerfil) {
  const res = await apiClient.get("/api/v1/Menu/GetMenusByUser", {
    params: { idUsuario, idPerfil },
  });
  return unwrap(res);
}

/** GET /api/v1/Menu/GetMenusByProfile?idPerfil= */
export async function getMenusByProfile(idPerfil) {
  const res = await apiClient.get("/api/v1/Menu/GetMenusByProfile", {
    params: { idPerfil },
  });
  return unwrap(res);
}
