import React from 'react';
import { CompoundModeToggleProps, CONSULTA_DIRECCION_CONFIG } from '../../types/enums';

const CompoundModeToggle: React.FC<CompoundModeToggleProps> = ({ modoCompuesto, onToggle, disabled }) => {
  return (
    <div className="mb-4">
      <label className="flex items-center space-x-2 text-gray-700 cursor-pointer">
        <input
          type="checkbox"
          checked={modoCompuesto}
          onChange={onToggle}
          className="form-checkbox h-5 w-5 text-blue-600 transition-colors duration-200"
          disabled={disabled}
        />
        <span className="select-none">
          {CONSULTA_DIRECCION_CONFIG.COMPOUND_MODE_LABEL}
        </span>
      </label>
    </div>
  );
};

export default CompoundModeToggle; 