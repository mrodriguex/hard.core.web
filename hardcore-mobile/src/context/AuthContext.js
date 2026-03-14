import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as loginApi } from '../services/authService';
import { setAuthToken } from '../services/apiClient';

const TOKEN_KEY = 'hardcore_mobile_token';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const savedToken = await AsyncStorage.getItem(TOKEN_KEY);
        if (savedToken) {
          setToken(savedToken);
          setAuthToken(savedToken);
        }
      } finally {
        setIsBootstrapping(false);
      }
    })();
  }, []);

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      isBootstrapping,
      async login(username, password) {
        const result = await loginApi(username, password);
        if (!result.success) return result;

        setToken(result.token);
        setAuthToken(result.token);
        await AsyncStorage.setItem(TOKEN_KEY, result.token);
        return result;
      },
      async logout() {
        setToken(null);
        setAuthToken(null);
        await AsyncStorage.removeItem(TOKEN_KEY);
      },
    }),
    [token, isBootstrapping]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
