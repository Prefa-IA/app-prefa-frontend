import React from 'react';
import AddressList from '../generales/AddressList';
import { AddressManagementProps } from '../../types/enums';

const AddressManagement: React.FC<AddressManagementProps> = ({
  modoCompuesto,
  direcciones,
  onEliminarDireccion,
  onConsultarDirecciones,
  loading,
  hasResult
}) => {
  if (!modoCompuesto) return null;

  return (
    <AddressList 
      addresses={direcciones}
      onRemove={onEliminarDireccion}
      onSearch={onConsultarDirecciones}
      isLoading={loading}
      minCount={2}
      hasResult={!!hasResult}
    />
  );
};

export default AddressManagement; 