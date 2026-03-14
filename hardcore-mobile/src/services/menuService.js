import { apiClient, unwrap } from './apiClient';

export async function getAll({ activo, pageIndex = 1, pageSize = 20 } = {}) {
  const params = { pageIndex, pageSize };
  if (activo !== undefined) params.activo = activo;
  const response = await apiClient.get('/api/v1/Menu/GetAll', { params });
  return unwrap(response);
}

export async function getById(idMenu) {
  const response = await apiClient.get('/api/v1/Menu/GetById', {
    params: { idMenu },
  });
  return unwrap(response);
}

export async function add(menu) {
  const response = await apiClient.post('/api/v1/Menu/Add', menu);
  return unwrap(response);
}

export async function update(menu) {
  const response = await apiClient.put('/api/v1/Menu/Update', menu);
  return unwrap(response);
}

export async function remove(idMenu) {
  const response = await apiClient.delete('/api/v1/Menu/Delete', {
    params: { idMenu },
  });
  return unwrap(response);
}

export async function getMenusByUser(idUsuario, idPerfil) {
  const response = await apiClient.get('/api/v1/Menu/GetMenusByUser', {
    params: { idUsuario, idPerfil },
  });
  return unwrap(response);
}

export async function getMenusByProfile(idPerfil) {
  const response = await apiClient.get('/api/v1/Menu/GetMenusByProfile', {
    params: { idPerfil },
  });
  return unwrap(response);
}
