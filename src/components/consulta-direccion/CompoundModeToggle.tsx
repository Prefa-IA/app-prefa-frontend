import React from 'react';

import { CompoundModeToggleProps, CONSULTA_DIRECCION_CONFIG } from '../../types/enums';

// PENDIENTE PREFACTIBILIDADES COMPUESTAS
const CompoundModeToggle: React.FC<CompoundModeToggleProps> = ({
  modoCompuesto: _modoCompuesto,
  onToggle: _onToggle,
  disabled: _disabled,
}) => {
  // Prefactibilidades compuestas deshabilitadas temporalmente
  const isDisabled = true;

  return (
    <div className="mb-4">
      <label className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 cursor-not-allowed select-none opacity-60">
        <input
          type="checkbox"
          checked={false}
          onChange={() => {}}
          className="form-checkbox h-5 w-5 text-primary-600 dark:text-primary-500 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 transition-colors duration-200"
          disabled={isDisabled}
        />
        <span className="select-none">
          {CONSULTA_DIRECCION_CONFIG.COMPOUND_MODE_LABEL}{' '}
          <span className="text-sm italic">(Próximamente...)</span>
        </span>
      </label>
    </div>
  );
};

export default CompoundModeToggle;
