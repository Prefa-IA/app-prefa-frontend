import React from 'react';

import { BillingInfo } from '../../types/billing';

interface BillingAddressRow1Props {
  form: BillingInfo;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const BillingAddressRow1: React.FC<BillingAddressRow1Props> = ({ form, handleChange }) => (
  <div className="grid grid-cols-3 gap-4">
    <div>
      <label htmlFor="calle" className="block text-sm font-medium mb-1">
        Calle
      </label>
      <input
        id="calle"
        name="calle"
        placeholder="9 de julio"
        value={form.calle}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
      />
    </div>
    <div>
      <label htmlFor="altura" className="block text-sm font-medium mb-1">
        Altura
      </label>
      <input
        id="altura"
        name="altura"
        placeholder="1234"
        value={form.altura}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
      />
    </div>
    <div>
      <label htmlFor="localidad" className="block text-sm font-medium mb-1">
        Localidad
      </label>
      <input
        id="localidad"
        name="localidad"
        placeholder="Villa Allende"
        value={form.localidad}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
      />
    </div>
  </div>
);

export default BillingAddressRow1;
