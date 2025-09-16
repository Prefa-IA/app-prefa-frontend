import React from 'react';
import SearchBar from '../generales/SearchBar';
import { SearchSectionProps } from '../../types/enums';

const SearchSection: React.FC<SearchSectionProps> = ({
  direccion,
  onDireccionChange,
  onSearch,
  modoCompuesto,
  loading,
  sugerencias,
  onInputChange,
  onSeleccionarSugerencia,
  consultarPorSMP,
  onToggleConsultarPorSMP,
  hasResult,
  onClear,
  disabled
}) => {
  return (
    <div className="space-y-2">
      <SearchBar 
        value={direccion}
        onChange={onDireccionChange}
        onSearch={onSearch}
        isCompoundMode={modoCompuesto}
        isLoading={loading}
        sugerencias={sugerencias}
        onInputChange={onInputChange}
        onSeleccionarSugerencia={onSeleccionarSugerencia}
        placeholder={consultarPorSMP ? 'Ingrese código SMP' : undefined}
        hasResult={hasResult}
        onClear={onClear}
        disabled={disabled}
      />

      {/* Mostrar checkbox sólo si se provee handler */}
      {onToggleConsultarPorSMP && (
        <label className="flex items-center space-x-2 text-sm select-none">
          <input 
            type="checkbox" 
            checked={consultarPorSMP}
            onChange={onToggleConsultarPorSMP}
          />
          <span>Consultar SMP directamente</span>
        </label>
      )}
    </div>
  );
};

export default SearchSection; 