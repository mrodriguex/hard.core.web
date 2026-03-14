import React from 'react';
import EntityListScreen from '../components/EntityListScreen';
import * as empresaService from '../services/empresaService';

export default function EmpresasScreen() {
  return (
    <EntityListScreen
      title="Empresas"
      fetchItems={empresaService.getAll}
      getPrimaryText={(item) => item?.nombre || 'Sin nombre'}
      getSecondaryText={(item) => item?.razonSocial || item?.abreviatura || ''}
      getStatus={(item) => (item?.activo ? 'Activa' : 'Inactiva')}
    />
  );
}
