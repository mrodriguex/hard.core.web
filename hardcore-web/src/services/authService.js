import { apiClient, normalizeApiError, setAuthToken } from './apiClient';

const TOKEN_KEY = 'token';
const USERNAME_KEY = 'username';

export async function login(username, password) {
  try {
    const cleanUsername = username?.trim() ?? '';
    const response = await apiClient.post('/api/v1/Auth/login', {
      username: cleanUsername,
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

    localStorage.setItem(TOKEN_KEY, token);
    if (cleanUsername) {
      localStorage.setItem(USERNAME_KEY, cleanUsername);
    }
    setAuthToken(token);
    return { success: true, token };
  } catch (error) {
    return {
      success: false,
      message: normalizeApiError(error, 'Error al iniciar sesión.'),
    };
  }
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USERNAME_KEY);
  setAuthToken(null);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUsername() {
  return localStorage.getItem(USERNAME_KEY);
}

export function isAuthenticated() {
  return Boolean(getToken());
}
