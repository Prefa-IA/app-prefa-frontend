import React from 'react';

import { BillingInfo } from '../../types/billing';
import { PAISES, PROVINCIAS } from '../../types/constants';

interface BillingAddressRow2Props {
  form: BillingInfo;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const BillingAddressRow2: React.FC<BillingAddressRow2Props> = ({ form, handleChange }) => (
  <div className="grid grid-cols-3 gap-4">
    <div>
      <label htmlFor="provincia" className="block text-sm font-medium mb-1">
        Provincia
      </label>
      <select
        id="provincia"
        name="provincia"
        value={form.provincia}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
      >
        <option value="" disabled>
          Seleccionar provincia
        </option>
        {PROVINCIAS.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
    </div>
    <div>
      <label htmlFor="codigoPostal" className="block text-sm font-medium mb-1">
        Código postal
      </label>
      <input
        id="codigoPostal"
        name="codigoPostal"
        placeholder="1657"
        value={form.codigoPostal}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
      />
    </div>
    <div>
      <label htmlFor="pais" className="block text-sm font-medium mb-1">
        País
      </label>
      <select
        id="pais"
        name="pais"
        value={form.pais}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
      >
        {PAISES.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
    </div>
  </div>
);

export default BillingAddressRow2;
