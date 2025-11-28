export type TipoPrefa = 'prefa1' | 'prefa2' | '';

export const TIPO_PREFA = {
  SIMPLE: 'prefa1' as TipoPrefa,
  COMPLETA: 'prefa2' as TipoPrefa,
} as const;

export interface NavConfirmState {
  show: boolean;
  href: string | null;
}

export interface ProcessingState {
  isProcessing: boolean;
  counter: number;
}

export const PROCESSING_CONFIG = {
  INITIAL_COUNTER: 60,
  MAX_RETRIES: 3,
  CRITICAL_FIELDS: [
    'superficie_edificable',
    'superficie_maxima_edificable',
    'total_pisos',
    'total_capacidad_constructiva',
  ],
} as const;

export const NAVIGATION_WARNING =
  'Si cambias de sección dejarás de ver el informe en curso. Podrás volver a verlo en la sección de Registros en el apartado de "Mis informes".';
