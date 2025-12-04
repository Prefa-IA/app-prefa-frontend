import { BillingInfo } from '../types/billing';

import { validateCuit, validateNombreCompleto } from './validation-utils';

export const validateBillingInfo = (form: BillingInfo): string | null => {
  // Validar que todos los campos requeridos estén completos
  for (const key of [
    'nombreCompleto',
    'condicionIVA',
    'cuit',
    'calle',
    'altura',
    'localidad',
    'provincia',
    'codigoPostal',
    'pais',
  ]) {
    if (!form[key as keyof BillingInfo]) return 'Completa todos los campos';
  }

  // Validar nombre completo
  const validacionNombre = validateNombreCompleto(form.nombreCompleto);
  if (!validacionNombre.valid) {
    return validacionNombre.error || 'Nombre completo inválido';
  }

  // Validar CUIT con dígito verificador
  const validacionCuit = validateCuit(form.cuit);
  if (!validacionCuit.valid) {
    return validacionCuit.error || 'CUIT inválido';
  }

  return null;
};
