import { apiClient, unwrap } from './apiClient';

export async function getAll({ activo, pageIndex = 1, pageSize = 20 } = {}) {
  const params = { pageIndex, pageSize };
  if (activo !== undefined) params.activo = activo;
  const response = await apiClient.get('/api/v1/Empresa/GetAll', { params });
  return unwrap(response);
}

export async function getById(idEmpresa) {
  const response = await apiClient.get('/api/v1/Empresa/GetById', {
    params: { idEmpresa },
  });
  return unwrap(response);
}

export async function add(empresa) {
  const response = await apiClient.post('/api/v1/Empresa/Add', empresa);
  return unwrap(response);
}

export async function update(empresa) {
  const response = await apiClient.put('/api/v1/Empresa/Update', empresa);
  return unwrap(response);
}

export async function remove(idEmpresa) {
  const response = await apiClient.delete('/api/v1/Empresa/Delete', {
    params: { idEmpresa },
  });
  return unwrap(response);
}
