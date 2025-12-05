import React from 'react';

import { FontSelectorProps } from '../../types/components';

const FontSelector: React.FC<FontSelectorProps> = ({ value, onChange, disabled }) => (
  <div className="space-y-3">
    <div>
      <label
        htmlFor="fontSelector"
        className="block text-sm font-medium text-gray-900 dark:text-gray-100"
      >
        Tipografía
      </label>
      <p className="text-xs text-gray-500 dark:text-gray-400">Fuente de textos para los informes</p>
    </div>
    <select
      id="fontSelector"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg disabled:bg-gray-50 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-gray-100"
    >
      <option value="Inter">Inter (Recomendada)</option>
      <option value="Roboto">Roboto</option>
      <option value="Open Sans">Open Sans</option>
      <option value="Montserrat">Montserrat</option>
      <option value="Lato">Lato</option>
      <option value="Poppins">Poppins</option>
    </select>
  </div>
);

export default FontSelector;
