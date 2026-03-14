import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError('');
    if (!username.trim() || !password.trim()) {
      setError('Por favor ingresa usuario y contraseña.');
      return;
    }

    setLoading(true);
    const result = await login(username, password);
    setLoading(false);

    if (!result.success) {
      setError(result.message || 'Error al iniciar sesión.');
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.title}>HARDCORE</Text>
        <Text style={styles.subtitle}>Iniciar Sesión</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="Usuario"
          autoCapitalize="none"
          editable={!loading}
          style={styles.input}
        />

        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Contraseña"
          secureTextEntry
          editable={!loading}
          style={styles.input}
        />

        <TouchableOpacity
          disabled={loading}
          onPress={handleLogin}
          style={[styles.button, loading ? styles.buttonDisabled : null]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Ingresar</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    padding: 18,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1d4ed8',
    textAlign: 'center',
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 14,
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
  error: {
    marginBottom: 10,
    color: '#b91c1c',
    fontSize: 13,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 4,
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#93c5fd',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
});
