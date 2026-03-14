import React from 'react';
import EntityListScreen from '../components/EntityListScreen';
import * as clienteService from '../services/clienteService';

export default function ClientesScreen() {
  return (
    <EntityListScreen
      title="Clientes"
      fetchItems={clienteService.getAll}
      getPrimaryText={(item) => item?.nombre || 'Sin nombre'}
      getSecondaryText={(item) => item?.rfc || item?.razonSocial || ''}
      getStatus={(item) => (item?.activo ? 'Activo' : 'Inactivo')}
    />
  );
}
