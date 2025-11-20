import React from 'react';

import { BillingInfo } from '../../types/billing';

interface BillingPersonalInfoFieldsProps {
  form: BillingInfo;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const IVA_CONDITIONS = [
  'Responsable Inscripto',
  'Responsable No Inscripto',
  'No Responsable',
  'Sujeto Exento',
  'Consumidor Final',
  'Monotributista',
  'Sujeto no categorizado',
  'Proveedor Extranjero',
  'Consumidor Extranjero',
  'IVA Liberado – Ley Nº 19.640',
  'IVA Responsable Inscripto – Agente de Percepción',
  'Pequeño Contribuyente Eventual',
  'Monotributista Social',
  'Pequeño Contribuyente Eventual Social',
];

const BillingPersonalInfoFields: React.FC<BillingPersonalInfoFieldsProps> = ({
  form,
  handleChange,
}) => (
  <>
    <div>
      <label htmlFor="nombreCompleto" className="block text-sm font-medium mb-1">
        Nombre y apellido completos
      </label>
      <input
        id="nombreCompleto"
        name="nombreCompleto"
        placeholder="Juan Pérez"
        value={form.nombreCompleto}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
      />
    </div>
    <div>
      <label htmlFor="condicionIVA" className="block text-sm font-medium mb-1">
        Condición fiscal
      </label>
      <select
        id="condicionIVA"
        name="condicionIVA"
        value={form.condicionIVA}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
      >
        {IVA_CONDITIONS.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
    <div>
      <label htmlFor="cuit" className="block text-sm font-medium mb-1">
        CUIT/CUIL
      </label>
      <input
        id="cuit"
        name="cuit"
        placeholder="10123456789"
        value={form.cuit}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
      />
    </div>
  </>
);

export default BillingPersonalInfoFields;
