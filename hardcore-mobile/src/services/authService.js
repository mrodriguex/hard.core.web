import { apiClient, normalizeApiError } from './apiClient';

export async function login(username, password) {
  try {
    const response = await apiClient.post('/api/v1/Auth/login', {
      username,
      password,
    });

    const { success, data, message } = response.data ?? {};
    if (!success) {
      return { success: false, message: message || 'Error al iniciar sesión.' };
    }

    const token = typeof data === 'string' ? data : data?.token ?? null;
    if (!token) {
      return {
        success: false,
        message: 'No se recibió un token de autenticación.',
      };
    }

    return { success: true, token };
  } catch (error) {
    return {
      success: false,
      message: normalizeApiError(error, 'Error al iniciar sesión.'),
    };
  }
}
