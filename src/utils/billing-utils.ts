import { BillingInfo } from '../types/billing';

export const validateBillingInfo = (form: BillingInfo): string | null => {
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
  if (!/^[0-9]{11}$/.test(form.cuit)) return 'CUIT inválido';
  return null;
};
