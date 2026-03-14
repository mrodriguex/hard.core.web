import React from 'react';
import EntityListScreen from '../components/EntityListScreen';
import * as menuService from '../services/menuService';

export default function MenusScreen() {
  return (
    <EntityListScreen
      title="Menús"
      fetchItems={menuService.getAll}
      getPrimaryText={(item) => item?.nombre || 'Sin nombre'}
      getSecondaryText={(item) => item?.ruta || item?.abreviatura || ''}
      getStatus={(item) => (item?.activo ? 'Activo' : 'Inactivo')}
    />
  );
}
