import { apiClient, unwrap } from './apiClient';

export async function getAll({ activo, pageIndex = 1, pageSize = 20 } = {}) {
  const params = { pageIndex, pageSize };
  if (activo !== undefined) params.activo = activo;
  const response = await apiClient.get('/api/v1/Cliente/GetAll', { params });
  return unwrap(response);
}

export async function getById(idCliente) {
  const response = await apiClient.get('/api/v1/Cliente/GetById', {
    params: { idCliente },
  });
  return unwrap(response);
}

export async function add(cliente) {
  const response = await apiClient.post('/api/v1/Cliente/Add', cliente);
  return unwrap(response);
}

export async function update(cliente) {
  const response = await apiClient.put('/api/v1/Cliente/Update', cliente);
  return unwrap(response);
}

export async function remove(idCliente) {
  const response = await apiClient.delete('/api/v1/Cliente/Delete', {
    params: { idCliente },
  });
  return unwrap(response);
}
