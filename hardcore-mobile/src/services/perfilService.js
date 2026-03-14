import { apiClient, unwrap } from './apiClient';

export async function getAll({ activo, pageIndex = 1, pageSize = 20 } = {}) {
  const params = { pageIndex, pageSize };
  if (activo !== undefined) params.activo = activo;
  const response = await apiClient.get('/api/v1/Perfil/GetAll', { params });
  return unwrap(response);
}

export async function getById(idPerfil) {
  const response = await apiClient.get('/api/v1/Perfil/GetById', {
    params: { idPerfil },
  });
  return unwrap(response);
}

export async function add(perfil) {
  const response = await apiClient.post('/api/v1/Perfil/Add', perfil);
  return unwrap(response);
}

export async function update(perfil) {
  const response = await apiClient.put('/api/v1/Perfil/Update', perfil);
  return unwrap(response);
}

export async function remove(idPerfil) {
  const response = await apiClient.delete('/api/v1/Perfil/Delete', {
    params: { idPerfil },
  });
  return unwrap(response);
}

export async function getUserProfiles(idUsuario) {
  const response = await apiClient.get('/api/v1/Perfil/GetUserProfiles', {
    params: { idUsuario },
  });
  return unwrap(response);
}
