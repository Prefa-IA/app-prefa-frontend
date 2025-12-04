import React, { useEffect, useState } from 'react';

import { BillingInfo } from '../../types/billing';
import { validateCuit, validateNombreCompleto } from '../../utils/validation-utils';

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

const useFormValidation = (
  nombreCompleto: string,
  cuit: string
): { nombreCompleto?: string | undefined; cuit?: string | undefined } => {
  const [errors, setErrors] = useState<{
    nombreCompleto?: string | undefined;
    cuit?: string | undefined;
  }>({});

  useEffect(() => {
    const newErrors: {
      nombreCompleto?: string | undefined;
      cuit?: string | undefined;
    } = {};

    if (nombreCompleto) {
      const validacionNombre = validateNombreCompleto(nombreCompleto);
      if (!validacionNombre.valid && validacionNombre.error) {
        newErrors.nombreCompleto = validacionNombre.error;
      }
    }

    if (cuit) {
      const validacionCuit = validateCuit(cuit);
      if (!validacionCuit.valid && validacionCuit.error) {
        newErrors.cuit = validacionCuit.error;
      }
    }

    setErrors(newErrors);
  }, [nombreCompleto, cuit]);

  return errors;
};

const NombreCompletoField: React.FC<{
  value: string;
  error?: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ value, error, onChange }) => (
  <div>
    <label htmlFor="nombreCompleto" className="block text-sm font-medium mb-1">
      Nombre y apellido completos <span className="text-red-500">*</span>
    </label>
    <input
      id="nombreCompleto"
      name="nombreCompleto"
      placeholder="Juan Pérez"
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
        error ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
      }`}
      maxLength={100}
    />
    {error && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{error}</p>}
  </div>
);

const CondicionIVAField: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}> = ({ value, onChange }) => (
  <div>
    <label htmlFor="condicionIVA" className="block text-sm font-medium mb-1">
      Condición fiscal <span className="text-red-500">*</span>
    </label>
    <select
      id="condicionIVA"
      name="condicionIVA"
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
    >
      {IVA_CONDITIONS.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

const CuitField: React.FC<{
  value: string;
  error?: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ value, error, onChange }) => (
  <div>
    <label htmlFor="cuit" className="block text-sm font-medium mb-1">
      CUIT/CUIL <span className="text-red-500">*</span>
    </label>
    <input
      id="cuit"
      name="cuit"
      type="text"
      placeholder="20123456789"
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
        error ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
      }`}
      maxLength={11}
      pattern="[0-9]*"
      inputMode="numeric"
    />
    {error && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{error}</p>}
    {!error && value && (
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        Formato: 11 dígitos (ej: 20123456789)
      </p>
    )}
  </div>
);

const BillingPersonalInfoFields: React.FC<BillingPersonalInfoFieldsProps> = ({
  form,
  handleChange,
}) => {
  const errors = useFormValidation(form.nombreCompleto || '', form.cuit || '');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.target.name === 'nombreCompleto' || e.target.name === 'cuit') {
      e.target.value = e.target.value.trim();
    }
    handleChange(e);
  };

  return (
    <>
      <NombreCompletoField
        value={form.nombreCompleto || ''}
        {...(errors.nombreCompleto ? { error: errors.nombreCompleto } : {})}
        onChange={handleInputChange}
      />
      <CondicionIVAField value={form.condicionIVA} onChange={handleChange} />
      <CuitField
        value={form.cuit || ''}
        {...(errors.cuit ? { error: errors.cuit } : {})}
        onChange={handleInputChange}
      />
    </>
  );
};

export default BillingPersonalInfoFields;
