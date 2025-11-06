export type CondicionIVA =
  | 'Responsable Inscripto'
  | 'Responsable No Inscripto'
  | 'No Responsable'
  | 'Sujeto Exento'
  | 'Consumidor Final'
  | 'Monotributista'
  | 'Sujeto no categorizado'
  | 'Proveedor Extranjero'
  | 'Consumidor Extranjero'
  | 'IVA Liberado – Ley Nº 19.640'
  | 'IVA Responsable Inscripto – Agente de Percepción'
  | 'Pequeño Contribuyente Eventual'
  | 'Monotributista Social'
  | 'Pequeño Contribuyente Eventual Social';

export interface BillingInfo {
  nombreCompleto: string;
  condicionIVA: CondicionIVA;
  cuit: string;
  calle: string;
  altura: string;
  localidad: string;
  provincia: string;
  codigoPostal: string;
  pais: string;
}
