export const TOTAL_TUTORIAL_STEPS = 6;

export interface TutorialStepContent {
  title: string;
  description: string;
  image?: string;
  highlightElement?: string;
}

export const TUTORIAL_STEPS: TutorialStepContent[] = [
  {
    title: '¡Bienvenido!',
    description: 'Te damos la bienvenida a nuestra plataforma. Este tutorial te ayudará a conocer las principales funcionalidades.',
  },
  {
    title: 'Análisis de Prefactibilidad',
    description: 'En esta sección puedes generar reportes completos de prefactibilidad. Busca una dirección, completa los datos y descarga tu informe personalizado.',
    highlightElement: '[data-tutorial="analisis-prefactibilidad"]',
  },
  {
    title: 'Buscar Dirección',
    description: 'Utiliza esta herramienta para buscar direcciones y generar consultas. Recuerda que recibes 50 créditos de bienvenida que se renuevan automáticamente el día 1 de cada mes.',
    highlightElement: '[data-tutorial="buscar-direccion"]',
  },
  {
    title: 'Registros',
    description: 'Accede a tus registros y direcciones guardadas. Puedes activar o desactivar el modo compuesto con el toggle para realizar consultas más complejas.',
    highlightElement: '[data-tutorial="registros"]',
  },
  {
    title: 'Mi Perfil',
    description: 'Personaliza tu experiencia: ajusta colores, tipografías, carga tu logo y gestiona toda tu información personal y de facturación.',
    highlightElement: '[data-tutorial="mi-perfil"]',
  },
  {
    title: 'Planes y Precios',
    description: 'Explora nuestros planes disponibles y elige el que mejor se adapte a tus necesidades. Puedes actualizar tu plan en cualquier momento.',
    highlightElement: '[data-tutorial="planes"]',
  },
];

export const STEP_ROUTES: Record<number, string | null> = {
  0: null,
  1: '/consultar',
  2: '/buscar',
  3: '/informes',
  4: '/perfil',
  5: '/suscripciones',
};

export const STEP_SELECTORS: Record<number, string> = {
  1: '[data-tutorial="analisis-prefactibilidad"]',
  2: '[data-tutorial="buscar-direccion"]',
  3: '[data-tutorial="registros"]',
  4: '[data-tutorial="mi-perfil"]',
  5: '[data-tutorial="planes"]',
};

