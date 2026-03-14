import axios from 'axios';

const API_BASE_URL = 'https://hardcoreapi.hookhub.app';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function setAuthToken(token) {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common.Authorization;
  }
}

export function unwrap(response) {
  const { success, data, message } = response.data ?? {};
  if (!success) {
    throw new Error(message || 'Error en la operación.');
  }
  return data;
}

export function normalizeApiError(error, fallbackMessage) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    fallbackMessage ||
    'Error inesperado.'
  );
}
