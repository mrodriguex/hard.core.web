import React from 'react';
import EntityListScreen from '../components/EntityListScreen';
import * as usuarioService from '../services/usuarioService';

export default function UsuariosScreen() {
  return (
    <EntityListScreen
      title="Usuarios"
      fetchItems={usuarioService.getAll}
      getPrimaryText={(item) => item?.nombreCompleto || item?.nombre || 'Sin nombre'}
      getSecondaryText={(item) => item?.correo || item?.nombreUsuario || ''}
      getStatus={(item) => (item?.bloqueado ? 'Bloqueado' : item?.activo ? 'Activo' : 'Inactivo')}
    />
  );
}
