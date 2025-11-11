export type TipoPrefa = 'prefa1' | 'prefa2';

export interface NavConfirmState {
  show: boolean;
  href: string | null;
}

export interface UvaModalState {
  show: boolean;
  defaultValue: number;
  resolve: (val: number | null) => void;
}

export interface ProcessingState {
  isProcessing: boolean;
  counter: number;
}

export const PROCESSING_CONFIG = {
  INITIAL_COUNTER: 5,
  MAX_RETRIES: 3,
  CRITICAL_FIELDS: [
    'superficie_edificable',
    'superficie_maxima_edificable',
    'total_pisos',
    'total_capacidad_constructiva'
  ]
} as const;

export const NAVIGATION_WARNING =
  'Si cambias de sección perderás la prefactibilidad en curso. Tené en cuenta que el crédito ya fue consumido.';


