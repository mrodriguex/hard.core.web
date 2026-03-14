import { apiClient, unwrap } from './apiClient';

export async function getAll({ activo, pageIndex = 1, pageSize = 20 } = {}) {
  const params = { pageIndex, pageSize };
  if (activo !== undefined) params.activo = activo;
  const response = await apiClient.get('/api/v1/Usuario/GetAll', { params });
  return unwrap(response);
}

export async function getById(idUsuario) {
  const response = await apiClient.get('/api/v1/Usuario/GetById', {
    params: { idUsuario },
  });
  return unwrap(response);
}

export async function exists(idUsuario) {
  const response = await apiClient.get('/api/v1/Usuario/Exists', {
    params: { idUsuario },
  });
  return unwrap(response);
}

export async function add(usuario) {
  const response = await apiClient.post('/api/v1/Usuario/Add', usuario);
  return unwrap(response);
}

export async function update(usuario) {
  const response = await apiClient.put('/api/v1/Usuario/Update', usuario);
  return unwrap(response);
}

export async function remove(idUsuario) {
  const response = await apiClient.delete('/api/v1/Usuario/Delete', {
    params: { idUsuario },
  });
  return unwrap(response);
}

export async function unlockUser(idUsuario) {
  const response = await apiClient.put('/api/v1/Usuario/UnlockUser', idUsuario);
  return unwrap(response);
}

export async function updatePassword(username, password) {
  const response = await apiClient.put('/api/v1/Usuario/UpdatePassword', {
    username,
    password,
  });
  return unwrap(response);
}
