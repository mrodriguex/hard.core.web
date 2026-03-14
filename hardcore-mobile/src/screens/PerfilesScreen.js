import React from 'react';
import EntityListScreen from '../components/EntityListScreen';
import * as perfilService from '../services/perfilService';

export default function PerfilesScreen() {
  return (
    <EntityListScreen
      title="Perfiles"
      fetchItems={perfilService.getAll}
      getPrimaryText={(item) => item?.nombre || 'Sin nombre'}
      getSecondaryText={(item) => item?.descripcion || item?.abreviatura || ''}
      getStatus={(item) => (item?.activo ? 'Activo' : 'Inactivo')}
    />
  );
}
