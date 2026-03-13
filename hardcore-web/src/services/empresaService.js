import axios from "axios";
import { getToken } from "./authService";

const API = "https://hardcoreapi.hookhub.app";

const apiClient = axios.create({ baseURL: API });

// Attach Bearer token to every request
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Unwrap the standard envelope { success, data, message }
function unwrap(response) {
  const { success, data, message } = response.data;
  if (!success) throw new Error(message || "Error en la operación.");
  return data;
}

/**
 * GET /api/v1/Empresa/GetAll
 * Returns { items: Empresa[], total: number } or Empresa[]
 */
export async function getAll({ activo, pageIndex = 1, pageSize = 10 } = {}) {
  const params = { pageIndex, pageSize };
  if (activo !== undefined) params.activo = activo;
  const res = await apiClient.get("/api/v1/Empresa/GetAll", { params });
  return unwrap(res);
}

/**
 * GET /api/v1/Empresa/GetById?idEmpresa=
 */
export async function getById(idEmpresa) {
  const res = await apiClient.get("/api/v1/Empresa/GetById", {
    params: { idEmpresa },
  });
  return unwrap(res);
}

/**
 * POST /api/v1/Empresa/Add
 * Body: Empresa
 */
export async function add(empresa) {
  const res = await apiClient.post("/api/v1/Empresa/Add", empresa);
  return unwrap(res);
}

/**
 * PUT /api/v1/Empresa/Update
 * Body: Empresa
 */
export async function update(empresa) {
  const res = await apiClient.put("/api/v1/Empresa/Update", empresa);
  return unwrap(res);
}

/**
 * DELETE /api/v1/Empresa/Delete?idEmpresa=
 */
export async function remove(idEmpresa) {
  const res = await apiClient.delete("/api/v1/Empresa/Delete", {
    params: { idEmpresa },
  });
  return unwrap(res);
}
