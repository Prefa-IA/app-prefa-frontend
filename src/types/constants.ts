export const PROVINCIAS = [
  'Buenos Aires',
  'Ciudad Autónoma de Buenos Aires',
  'Catamarca',
  'Chaco',
  'Chubut',
  'Córdoba',
  'Corrientes',
  'Entre Ríos',
  'Formosa',
  'Jujuy',
  'La Pampa',
  'La Rioja',
  'Mendoza',
  'Misiones',
  'Neuquén',
  'Río Negro',
  'Salta',
  'San Juan',
  'San Luis',
  'Santa Cruz',
  'Santa Fe',
  'Santiago del Estero',
  'Tierra del Fuego',
  'Tucumán',
];

export const PAISES = ['Argentina'];

export const PLAN_COLOR_MAP: Record<
  number,
  {
    border: string;
    bg: string;
    button: string;
    hover: string;
    featured: boolean;
    accent: string;
    hex: string;
  }
> = {
  1: {
    border: 'border-emerald-400',
    bg: 'from-emerald-50 via-white to-emerald-50',
    button: 'bg-gradient-to-r from-emerald-600 to-emerald-700',
    hover: 'from-emerald-700 to-emerald-800',
    featured: true,
    accent: 'emerald',
    hex: '#34d399',
  },
  2: {
    border: 'border-violet-400',
    bg: 'from-violet-50 via-white to-violet-50',
    button: 'bg-gradient-to-r from-violet-600 to-violet-700',
    hover: 'from-violet-700 to-violet-800',
    featured: false,
    accent: 'violet',
    hex: '#8b5cf6',
  },
  3: {
    border: 'border-rose-400',
    bg: 'from-rose-50 via-white to-rose-50',
    button: 'bg-gradient-to-r from-rose-600 to-rose-700',
    hover: 'from-rose-700 to-rose-800',
    featured: false,
    accent: 'rose',
    hex: '#fb7185',
  },
  4: {
    border: 'border-blue-400',
    bg: 'from-blue-50 via-white to-blue-50',
    button: 'bg-gradient-to-r from-blue-600 to-blue-700',
    hover: 'from-blue-700 to-blue-800',
    featured: false,
    accent: 'blue',
    hex: '#60a5fa',
  },
};

export const REPORT_TITLES = ['INFORME DE', 'FACTIBILIDAD', 'CONSTRUCTIVA'];
