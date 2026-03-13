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

/** GET /api/v1/Cliente/GetAll */
export async function getAll({ activo, pageIndex = 1, pageSize = 10 } = {}) {
  const params = { pageIndex, pageSize };
  if (activo !== undefined) params.activo = activo;
  const res = await apiClient.get("/api/v1/Cliente/GetAll", { params });
  return unwrap(res);
}

/** GET /api/v1/Cliente/GetById?idCliente= */
export async function getById(idCliente) {
  const res = await apiClient.get("/api/v1/Cliente/GetById", { params: { idCliente } });
  return unwrap(res);
}

/** POST /api/v1/Cliente/Add */
export async function add(cliente) {
  const res = await apiClient.post("/api/v1/Cliente/Add", cliente);
  return unwrap(res);
}

/** PUT /api/v1/Cliente/Update */
export async function update(cliente) {
  const res = await apiClient.put("/api/v1/Cliente/Update", cliente);
  return unwrap(res);
}

/** DELETE /api/v1/Cliente/Delete?idCliente= */
export async function remove(idCliente) {
  const res = await apiClient.delete("/api/v1/Cliente/Delete", { params: { idCliente } });
  return unwrap(res);
}
