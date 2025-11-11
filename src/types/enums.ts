export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  personalizacion?: {
    fondoEncabezadosPrincipales?: string;
    colorTextoTablasPrincipales?: string;
    fondoEncabezadosSecundarios?: string;
    colorTextoTablasSecundarias?: string;
    colorAcento?: string;
    tipografia?: string;
    logo?: string; // Logo en base64 o URL
  };
  consultasDisponibles?: number;
  suscripcion?: {
    fechaFin?: string;
    // Referencia al plan
    plan?: string; // Mongo ObjectId
    nombrePlan?: string; // Caché del nombre
    tipo?: string; // legado
  };

  // Sistema de créditos
  creditBalance?: number;
  creditsUsedDay?: number;
  creditsUsedMonth?: number;
  creditsDayReset?: string;
  creditsMonthReset?: string;
  promoCreditsLeft?: number;
  tutorialStatus?: 'finish' | 'omit' | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegistroData {
  email: string;
  password: string;
  nombre: string;
  repeatPassword?: string;
  acceptedTerms: boolean;
  recaptchaToken?: string;
}

export interface Coordenadas {
  lat: string;
  lon: string;
}

export interface DireccionData {
  direccion: string;
  altura: string;
  barrio: string;
  comuna: string;
  lat: string;
  lon: string;
  smp?: string;
}

export interface DatosCatastrales {
  smp: string;
  superficie: string;
  frente: string;
  fondo: string;
  zonificacion: string;
  alturaMaxima: string;
  alturaMaximaPlanoLimite: string;
  fot: string;
  fos: string;
  [key: string]: any;
}

export interface DatosUtiles {
  comuna: string;
  barrio: string;
  distritoEscolar: string;
  comisaria: string;
  comisariaVecinal: string;
  seccionCatastral: string;
  [key: string]: any;
}

export interface GeometriaFeature {
  type: string;
  geometry: {
    type: string;
    coordinates: Array<Array<Array<[number, number]>>>;
  };
  properties: {
    tipo: string;
    codigo: string;
    fuente: string;
    fecha_actualizacion: string;
  };
}

interface Geometria {
  type: string;
  features: GeometriaFeature[];
}

export interface Edificabilidad {
  adps: string;
  afectaciones: {
    apertura: number;
    ci_digital: number;
    ensanche: number;
    lep: number;
    riesgo_hidrico: number;
  };
  altura_max: number[];
  altura_max_plano_limite: number;
  catalogacion: {
    catalogacion: string | null;
    denominacion: string | null;
    estado: string | null;
    ley_3056: string | null;
    proteccion: string | null;
  };
  distrito_especial: Array<{
    distrito_agrupado: string;
    distrito_especifico: string;
  }>;
  fot: {
    fot_medianera: number;
    fot_perim_libre: number;
    fot_semi_libre: number;
  };
  irregular: boolean;
  manzanas_atipicas: {
    disposicio: string;
    pdf: string;
  };
  memo: string;
  microcentr: string;
  parcelas_linderas: {
    aph_linderas: boolean;
    smp_linderas: string[];
  };
  plusvalia: {
    alicuota: number;
    distrito_cpu: string;
    incidencia_uva: number;
    plusvalia_em: number;
    plusvalia_pl: number;
    plusvalia_sl: number;
    uvaOriginal?: number;
    uvaPersonalizado?: number;
  };
  // Nuevos parámetros urbanísticos
  enrase?: boolean;
  mixtura_uso?: number | null;
  aph_extra?: boolean;
  rivolta: number;
  subzona: string;
  sup_edificable_planta: number;
  sup_max_edificable: number;
  superficie_parcela: number;
  tipica: string;
  unidad_edificabilidad: number[];
  completamiento_tejido?: string;
  manzana_atipica?: string;
  patio_iluminacion?: string;
  aph?: string;
  profundidad_balcones?: string;
  balcones?: string;
  sup_construible?: string;
  lfi_disponible?: string;
  longitud_lfi?: string;
  altura_ini?: number;
  altura_fin?: number;
  tipo_edificacion?: string;
  codigo_edificabilidad?: string;
  troneras?: {
    cantidad: number;
    area_total: number;
    disponible: string;
  };
  link_imagen?: {
    croquis_parcela?: string;
    perimetro_manzana?: string;
    plano_indice?: string;
    [key: string]: string | undefined;
  };
}

export interface Entorno {
  espaciosVerdes: Array<{
    nombre: string;
    distancia: number;
  }>;
  transportes: Array<{
    tipo: string;
    linea: string;
    distancia: number;
  }>;
  servicios: any[];
  restricciones: string[];
}

export interface Informe {
  _id?: string;
  googleMaps: Coordenadas;
  direccion: DireccionData;
  direccionesNormalizadas: DireccionData[];
  datosCatastrales: DatosCatastrales;
  datosUtiles: DatosUtiles;
  geometria: Geometria;
  edificabilidad: Edificabilidad;
  entorno: Entorno;
  timestamp: string;
  tipoPrefa?: PrefaType;
}

export interface InformeCompuesto {
  direcciones: string[];
  informesIndividuales: Informe[];
  informeConsolidado: Informe;
}

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  isCompoundMode: boolean;
  isLoading: boolean;
  placeholder?: string;
  sugerencias?: Array<{ direccion: string }>;
  onInputChange?: (value: string) => void;
  onSeleccionarSugerencia?: (direccion: string) => void;
  hasResult?: boolean;
  onClear?: () => void;
  disabled?: boolean;
  singleModeIcon?: boolean;
}

export interface Sugerencia {
  direccion: string;
}

export interface ChangeLogEntry {
  fieldName: string;
  originalValue: any;
  newValue: any;
  timestamp: Date;
}

export interface ReportPreviewProps {
  informe: Informe;
  informeCompuesto?: InformeCompuesto;
  isCompoundMode: boolean;
  addresses: string[];
  isLoading: boolean;
  center: {
    lat: number;
    lng: number;
  };
  onGenerateReport: () => void;
  onAcceptReport: () => Promise<boolean>;
  tipoPrefa: PrefaType;
}

export interface ReportHeaderProps {
  informe: Informe;
  isCompoundMode: boolean;
  addresses: string[];
}

export interface ReportFooterProps {
  informe: Informe;
  onGenerateReport?: () => void;
  onAcceptReport?: () => Promise<boolean>;
  changeLog?: ChangeLogEntry[];
}

export interface IndexItem {
  texto: string;
  pagina: number;
  nivel: number;
}

// SearchBar Component Interfaces
export interface SuggestionsListProps {
  sugerencias: Sugerencia[];
  onSelect: (direccion: string) => void;
}

export interface SuggestionItemProps {
  sugerencia: Sugerencia;
  onSelect: (direccion: string) => void;
}

// ReportIndex Component Interfaces
export interface IndexListProps {
  items: IndexItem[];
}

export interface IndexItemComponentProps {
  item: IndexItem;
}

export interface PageNumberProps {
  pageNumber: number;
}

// ReportHeader Component Interfaces
export interface ReportTitlesProps {
  titles: string[];
}

export interface ReportAddressProps {
  address: string;
}

export interface ReportBrandProps {
  isCompoundMode: boolean;
}

// ReportFooter Component Interfaces
export interface FooterActionsProps {
  onAcceptReport?: () => Promise<boolean>;
  onGenerateReport?: () => void;
}

export interface ActionButtonProps {
  onClick?: () => void;
  variant: ButtonVariant;
  icon: React.ReactNode;
  text: string;
  disabled?: boolean;
}

export interface ChangeLogTableProps {
  changeLog: ChangeLogEntry[];
}

export interface ChangeLogTableBodyProps {
  changeLog: ChangeLogEntry[];
}

// RegistroForm Component Interfaces
export interface FormField {
  id: string;
  name: keyof RegistroData;
  type: InputType;
  label: string;
  placeholder: string;
  required: boolean;
  autoComplete?: string;
  maxLength?: number;
}

export interface RegistrationFormProps {
  datos: RegistroData;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export interface FormFieldsProps {
  datos: RegistroData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  showPass: boolean;
  setShowPass: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface FormFieldProps {
  field: FormField;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPass: boolean;
  setShowPass: React.Dispatch<React.SetStateAction<boolean>>;
}

export enum ButtonVariant {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  SUCCESS = 'success',
  DANGER = 'danger'
}

export enum InputType {
  TEXT = 'text',
  EMAIL = 'email',
  PASSWORD = 'password'
}

export const SEARCH_CONFIG = {
  MIN_CHARS_FOR_SUGGESTIONS: 3,
  PLACEHOLDER_DEFAULT: 'Ingrese una dirección de CABA (ej. Corrientes 1234)'
} as const;

export const REPORT_CONFIG = {
  BRAND_NAME: 'PreFactibilidad',
  BRAND_SUFFIX: 'BA',
  COMPOUND_LABEL: 'Compuesta'
} as const;

// PerfilUsuario Component Interfaces
export interface ProfileFieldProps {
  label: string;
  value: string;
  isAlternate?: boolean;
}

export interface SubscriptionStatusProps {
  usuario: Usuario;
}

export interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
  href?: string;
}

// ParcelMapPage Component Interfaces
export interface ParcelMapPageProps {
  informe: Informe;
}

export interface PlanoContainerProps {
  coordinates: [number, number][];
  datosCatastrales: DatosCatastrales;
  datosEdificabilidad: Edificabilidad;
}

export interface ParcelInfoProps {
  geometria?: Geometria;
}

// ParcelaPlano Component Interfaces
export interface ParcelaPlanoProps {
  coordinates: [number, number][];
  datosCatastrales?: {
    superficie_total?: string | number;
    frente?: string | number;
    fondo?: string | number;
  };
  datosEdificabilidad?: {
    altura_max?: (string | number)[];
    fot?: {
      fot_medianera?: string | number;
    };
  };
}

export interface CanvasDrawingProps {
  coordinates: [number, number][];
  datosCatastrales?: ParcelaPlanoProps['datosCatastrales'];
  datosEdificabilidad?: ParcelaPlanoProps['datosEdificabilidad'];
  canvas: HTMLCanvasElement;
}

// Navbar Component Interfaces
export interface NavigationItem {
  name: string;
  href: string;
}

export interface UserMenuProps {
  usuario: Usuario;
  onLogout: () => void;
}

export interface MobileMenuProps {
  navigation: NavigationItem[];
  usuario: Usuario | null;
}

export interface AuthButtonsProps {
  className?: string;
}

// LoginForm Component Interfaces
export interface LoginFormProps {
  onSubmit?: (credentials: LoginCredentials) => void;
}

export interface LoginFieldProps {
  id: string;
  name: keyof LoginCredentials;
  type: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoComplete?: string;
  required?: boolean;
}

// Configuration Constants
export const PROFILE_CONFIG = {
  TITLE: 'Perfil de Usuario',
  SUBTITLE: 'Información personal y detalles de la cuenta.',
  ACTIONS: {
    MANAGE_SUBSCRIPTION: {
      title: 'Gestionar suscripción',
      description: 'Actualizar plan o método de pago'
    },
    EDIT_PROFILE: {
      title: 'Editar perfil',
      description: 'Actualizar información personal'
    }
  }
} as const;

export const PARCEL_MAP_CONFIG = {
  TITLE: 'PLANO DE LA PARCELA',
  PAGE_NUMBER: 4,
  CANVAS_DIMENSIONS: {
    WIDTH: 800,
    HEIGHT: 600
  },
  STYLE: {
    WIDTH: '100%',
    HEIGHT: '500px'
  }
} as const;

export const NAVBAR_CONFIG = {
  BRAND_NAME: 'PreFactibilidad BA',
  NAVIGATION: [
    { name: 'Inicio', href: '/' },
    { name: 'Generar informe', href: '/consultar' },
    { name: 'Buscar dirección', href: '/buscar' },
    { name: 'Registros', href: '/informes' },
    { name: 'Precios', href: '/suscripciones' },
  ]
} as const;

export const LOGIN_CONFIG = {
  TITLE: 'Iniciar sesión',
  SUBMIT_TEXT: 'Iniciar sesión',
  FIELDS: [
    {
      id: 'email',
      name: 'email' as keyof LoginCredentials,
      type: 'email',
      label: 'Email',
      placeholder: 'Correo@ejemplo.com',
      autoComplete: 'email',
      required: true
    },
    {
      id: 'password',
      name: 'password' as keyof LoginCredentials,
      type: 'password',
      label: 'Contraseña',
      placeholder: 'Contraseña',
      autoComplete: 'current-password',
      required: true
    }
  ]
} as const;

// ParcelDataPage Component Interfaces
export interface ParcelDataPageProps {
  informe: Informe;
  informeCompuesto?: InformeCompuesto;
  esInformeCompuesto?: boolean;
  tipoPrefa: PrefaType;
  onChangeLogUpdate?: (changeLog: ChangeLogEntry[]) => void;
}

export interface GeneralConsiderationsProps {
  pageCounter: number;
}

export interface BasicInformationProps {
  informe: Informe;
  informeCompuesto?: InformeCompuesto;
  esInformeCompuesto: boolean;
  calculatedValues: {
    totalCapConstructiva: number;
    plusvaliaFinal: number;
  };
  pageCounter: number;
}

export interface ParcelDataTablesProps {
  informe: Informe;
  informeCompuesto?: InformeCompuesto;
  esInformeCompuesto?: boolean;
  calculatedValues: {
    superficieParcela: number;
    frenteValor: number;
    fotMedanera: number;
    alturaMax: number;
    tipoEdificacion: string;
    alicuota: number;
  };
  pageCounter: number;
}

export interface FacadeImagesProps {
  fachadaImages: string[];
  pageCounter: number;
}

export interface DocumentViewerProps {
  informe: Informe;
  informeCompuesto?: InformeCompuesto;
  esInformeCompuesto: boolean;
  documentosVisuales: {
    croquis: string[];
    perimetros: string[];
    planosIndice: string[];
  };
  pageCounter: number;
  pageNumbers?: {
    croquis: number;
    perimetro: number;
    planoIndice: number;
    lbiLfi: number;
  };
}

export interface PlusvaliaCalculationProps {
  informe: Informe;
  informeCompuesto?: InformeCompuesto;
  esInformeCompuesto?: boolean;
  calculatedValues: {
    superficieParcela: number;
    superficieParcelaAjustada: number;
    frenteValor: number;
    fotMedanera: number;
    alturaMax: number;
    tipoEdificacion: string;
    totalPisos: number;
    areaPlantasTipicas: number;
    areaPrimerRetiro: number;
    areaSegundoRetiro: number;
    totalCapConstructiva: number;
    a1: number;
    a2: number;
    a: number;
    b: number;
    axb: number;
    alicuota: number;
    plusvaliaFinal: number;
  };
  pageCounter: number;
}

export interface LbiLfiSectionProps {
  informe: Informe;
}

// Table Component Interfaces
export interface DataTableProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export interface TableRowProps {
  label: string;
  value: React.ReactNode;
  isAlternate?: boolean;
}

export interface DocumentosVisuales {
  croquis: string[];
  perimetros: string[];
  planosIndice: string[];
}

export interface DocumentItemProps {
  url: string;
  title: string;
  index?: number;
  defaultImageUrl: string;
}

export interface PdfViewerProps {
  url: string;
  title: string;
  className?: string;
}

// Configuration Constants
export const PARCEL_DATA_CONFIG = {
  PAGE_BREAK_CLASS: 'page-break my-8',
  TABLE_HEADER_CLASS: 'text-center p-3 font-bold',
  TABLE_BORDER_CLASS: 'rounded-lg overflow-hidden bg-white',
  TABLE_CONTAINER_CLASS: 'mb-6 bg-white rounded-lg',
  GRID_COLS_2: 'grid grid-cols-2 text-sm',
  GRID_COLS_3: 'grid grid-cols-1 md:grid-cols-3 gap-4 mb-8',
  GRID_COLS_5: 'grid grid-cols-5 text-sm',
  GRID_COLS_6: 'grid grid-cols-6 text-sm',
  TABLE_ROW_CLASS: 'hover:opacity-90 transition-colors duration-200',
  TABLE_CELL_LABEL: 'border-b border-r p-3 font-semibold bg-gray-50 text-gray-800',
  TABLE_CELL_VALUE: 'border-b p-3 text-gray-700',
  DEFAULT_IMAGES: {
    CROQUIS: '/images/default_croquis.jpg',
    PERIMETRO: '/images/default_perimetro.jpg',
    PLANO_INDICE: '/images/default_plano_indice.jpg',
    FACHADA: '/images/default_fachada.jpg'
  },
  CALCULATIONS: {
    PATIOS_ADJUSTMENT: 25,
    CAPACITY_PERCENTAGE: 0.8,
    FLOOR_HEIGHT: 3
  },
  PERSONALIZATION: {
    DEFAULT_COLORS: {
      PRIMARY: '#0284c7',
      SECONDARY: '#0369a1', 
      ACCENT: '#f0f9ff'
    },
    DEFAULT_FONT: 'Inter, system-ui, sans-serif'
  }
} as const;

// ListaInformes Component Interfaces
export interface ListaInformesProps {
  className?: string;
}

export interface InformeItemProps {
  informe: Informe;
  index: number;
  onDescargar: (informe: Informe) => void;
}

export interface InformeHeaderProps {
  informe: Informe;
  onDescargar: (informe: Informe) => void;
}

export interface InformeDetailsProps {
  informe: Informe;
}

// Home Component Interfaces
export interface HomeProps {
  className?: string;
}

export interface HeroSectionProps {
  usuario: any;
}

export interface FeatureSectionProps {
  features: FeatureItem[];
}

export interface FeatureItem {
  name: string;
  description: string;
  icon: React.ComponentType<any>;
}

export interface FeatureCardProps {
  feature: FeatureItem;
}

// ConsultaDireccion Component Interfaces
export interface ConsultaDireccionProps {
  className?: string;
}

export interface DireccionSugerida {
  direccion: string;
  nombre_calle: string;
  altura?: string;
  tipo: string;
}

export interface MapContainerProps {
  center: { lat: number; lng: number };
  showMarker?: boolean;
}

export interface CompoundModeToggleProps {
  modoCompuesto: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export interface SearchSectionProps {
  direccion: string;
  onDireccionChange: (value: string) => void;
  onSearch: () => void;
  modoCompuesto: boolean;
  loading: boolean;
  sugerencias: DireccionSugerida[];
  onInputChange: (value: string) => void;
  onSeleccionarSugerencia: (direccion: string) => void;
  consultarPorSMP?: boolean; // opcional
  onToggleConsultarPorSMP?: () => void; // opcional
  hasResult?: boolean;
  onClear?: () => void;
  disabled?: boolean;
  singleModeIcon?: boolean;
}

export interface AddressManagementProps {
  modoCompuesto: boolean;
  direcciones: string[];
  onEliminarDireccion: (index: number) => void;
  onConsultarDirecciones: () => void;
  loading: boolean;
  hasResult?: boolean;
}

export interface ReportSectionProps {
  resultado: Informe | null;
  informeCompuesto: InformeCompuesto | null;
  modoCompuesto: boolean;
  direcciones: string[];
  loading: boolean;
  center: { lat: number; lng: number };
  onGenerateReport: () => void;
  onAcceptReport: () => Promise<boolean>;
  tipoPrefa: PrefaType;
}

// AddressList Component Interfaces
export interface AddressListProps {
  addresses: string[];
  onRemove: (index: number) => void;
  onSearch: () => void;
  isLoading: boolean;
  minCount?: number;
  hasResult?: boolean;
}

export interface AddressItemProps {
  address: string;
  index: number;
  onRemove: (index: number) => void;
}

export interface AddressListHeaderProps {
  addressCount: number;
}

export interface SearchButtonProps {
  onSearch: () => void;
  isLoading: boolean;
  addressCount: number;
}

// Configuration Constants for Components
export const LISTA_INFORMES_CONFIG = {
  TITLE: 'Registros',
  SUBTITLE: 'Consultá tus informes y direcciones guardadas.',
  EMPTY_STATE: {
    TITLE: 'No hay informes',
    DESCRIPTION: 'Aún no has generado ningún informe de prefactibilidad.'
  },
  BUTTON_TEXT: 'Descargar PDF'
} as const;

export const HOME_CONFIG = {
  HERO: {
    TITLE: 'Prefactibilidad al instante,',
    SUBTITLE: 'para profesionales del rubro.',
    DESCRIPTION: 'Obtené el potencial constructivo de cualquier terreno en CABA en minutos, de forma rápida y precisa.',
    CTA_PRIMARY: 'Empezar ahora',
    CTA_REGISTER: 'Comenzar gratis',
    CTA_LOGIN: 'Iniciar sesión'
  },
  FEATURES: {
    SUBTITLE: 'Las herramientas que potencian tu análisis.',
    DESCRIPTION: 'Obtené la información que necesitás para tomar decisiones estratégicas en minutos.'
  }
} as const;

export const CONSULTA_DIRECCION_CONFIG = {
  TITLE: 'Análisis de prefactibilidad',
  COMPOUND_MODE_LABEL: 'Analizar lotes múltiples (linderos)',
  MAP: {
    DEFAULT_CENTER: { lat: -34.6037, lng: -58.3816 },
    ZOOM: 15,
    CONTAINER_STYLE: { width: '100%', height: '200px' }
  },
  MESSAGES: {
    LOGIN_REQUIRED: 'Debe iniciar sesión para realizar consultas.',
    ADDRESS_REQUIRED: 'Ingrese una dirección para consultar.',
    LOADING: 'Por favor, espere mientras se consultan los datos de la dirección...',
    ERROR_GENERAL: 'Error al consultar la dirección. Por favor intente nuevamente.',
    ERROR_PDF: 'Error al generar el informe PDF.',
    ERROR_SAVE: 'Error al guardar el informe.',
    NO_ADDRESSES_FOUND: 'No se encontraron direcciones en CABA. Por favor, especifique una dirección válida dentro de Ciudad Autónoma de Buenos Aires.',
    ERROR_SUGGESTIONS: 'Error al buscar direcciones. Por favor, intente nuevamente.'
  }
} as const;

export const ADDRESS_LIST_CONFIG = {
  TITLE: 'Direcciones agregadas:',
  EMPTY_MESSAGE: 'No hay direcciones agregadas',
  BUTTON_TEXT: 'Consultar prefactibilidad compuesta',
  BUTTON_LOADING: 'Consultando...'
} as const;

// LbiLfiViewer Component Interfaces
export interface LbiLfiViewerProps {
  smp: string;
  coordenadasReferencia: {
    lat: string | number;
    lon: string | number;
  };
}

export interface GeoJSONFeature {
  type: string;
  properties: any;
  geometry: {
    type: string;
    coordinates: any;
  };
}

export interface GeoJSONData {
  type: string;
  features: GeoJSONFeature[];
}

export interface MedicionesCalculadas {
  areaLIB?: number;
  areaLFI?: number;
  perimetroLIB?: number;
  perimetroLFI?: number;
  distanciaLIB_LFI?: number;
  totalTroneras?: number;
  areaTotalTroneras?: number;
}

export interface TroneraFeature {
  type: string;
  geometry: {
    type: string;
    coordinates: any;
  };
  properties: {
    tipo: string;
    posicion: string;
    metodo: string;
    area: number;
    perimetro: number;
    descripcion?: string;
    tamaño_metros?: number;
    tipo_esquina?: string;
    angulo?: number;
    distancia_anterior?: number;
    distancia_siguiente?: number;
  };
}

export interface GeoJSONDataState {
  superficieEdificable: GeoJSONFeature[] | null;
  lib: GeoJSONFeature[] | null;
  lfi: GeoJSONFeature[] | null;
  troneras: TroneraFeature[] | null;
  mapaManzanas: GeoJSONFeature[] | null;
  aph: GeoJSONFeature[] | null;
  tejido: GeoJSONFeature[] | null;
}

export interface MapContainerLbiProps {
  mapRef: React.RefObject<HTMLDivElement>;
  loading: boolean;
  loadingData: boolean;
  error: string | null;
  smp: string;
}

export interface MetricsDisplayProps {
  calculandoMetricas: boolean;
  mediciones: MedicionesCalculadas;
  geoJSONData: GeoJSONDataState;
}

export interface MapLegendProps {
  visualizacion3D: boolean;
  onToggleVisualizacion3D: () => void;
}

export interface TronerasTableProps {
  troneras: TroneraFeature[];
}

export interface MetricsGridProps {
  mediciones: MedicionesCalculadas;
}

// Configuration Constants for LbiLfiViewer
export const LBI_LFI_CONFIG = {
  MAP: {
    DEFAULT_HEIGHT: '500px',
    DEFAULT_ZOOM: 18,
    BOUNDS_PADDING: 0.1
  },
  MESSAGES: {
    LOADING_MAP: '🗺️ Inicializando mapa...',
    LOADING_DATA: '🔍 Consultando datos SHP...',
    LOADING_SUBTITLE: 'Procesando archivos LIB, LFI y calculando troneras',
    CALCULATING_METRICS: 'Calculando métricas...',
    NO_DATA: 'No se encontraron datos SHP para el código SMP',
    ERROR_INIT: 'Error al inicializar el mapa',
    ERROR_LOAD: 'Error al cargar datos'
  },
  STYLES: {
    SUPERFICIE_EDIFICABLE: {
      fillColor: "#FFD700",
      color: "#DAA520",
      weight: 2,
      opacity: 0.9,
      fillOpacity: 0.4,
      className: 'superficie-edificable-3d'
    },
    LIB: {
      color: "#F97316",
      weight: 4,
      opacity: 0.9,
      className: 'lib-line'
    },
    LFI: {
      color: "#3B82F6",
      weight: 4,
      opacity: 0.9,
      className: 'lfi-line'
    },
    MAPA_MANZANAS: {
      fillColor: "#F3F4F6",
      color: "#9CA3AF",
      weight: 1,
      opacity: 0.8,
      fillOpacity: 0.15,
      className: 'manzana-contexto'
    },
    BANDA_MINIMA: {
      color: "#9333EA",
      weight: 3,
      opacity: 0.8,
      dashArray: "10, 5",
      className: 'banda-minima'
    },
    TRONERAS: {
      fillColor: "#22C55E",
      color: "#16A34A",
      weight: 3,
      opacity: 1,
      fillOpacity: 0.7,
      className: 'tronera-3d'
    }
  },
  LEGEND: {
    ITEMS: [
      { color: '#E5E7EB', opacity: 0.2, border: '1px solid #6B7280', label: 'Manzanas' },
      { color: '#10B981', opacity: 0.25, border: '1px solid #047857', label: 'Tejido urbano' },
      { color: '#DC2626', opacity: 0.3, border: '2px solid #B91C1C', label: 'APH' },
      { color: '#FFD700', opacity: 0.4, border: '2px solid #DAA520', label: 'Superficie edificable' },
      { color: 'transparent', opacity: 1, border: '2px solid #F97316', label: 'LIB' },
      { color: 'transparent', opacity: 1, border: '2px solid #3B82F6', label: 'LFI' },
      { color: 'transparent', opacity: 1, border: '2px dashed #9333EA', label: 'Banda Mínima' },
      { color: '#22C55E', opacity: 0.8, border: '2px solid #16A34A', label: 'Troneras' }
    ]
  }
} as const;

// Dynamic Report Index Component Interfaces
export interface DynamicIndexItem {
  id: string;
  texto: string;
  pagina: number;
  nivel: number;
  seccion: IndexSectionType;
  visible: boolean;
  subItems?: DynamicIndexItem[];
}

export interface DynamicReportIndexProps {
  informe: Informe;
  informeCompuesto?: InformeCompuesto;
  esInformeCompuesto?: boolean;
  fachadaImages?: string[];
  documentosVisuales?: DocumentosVisuales;
}

export interface DynamicIndexListProps {
  items: DynamicIndexItem[];
}

export interface DynamicIndexItemProps {
  item: DynamicIndexItem;
}

export interface PageSectionConfig {
  id: string;
  title: string;
  subSections?: PageSectionConfig[];
  shouldInclude?: (informe: Informe, context: IndexGenerationContext) => boolean;
  pageOffset?: number;
}

export interface IndexGenerationContext {
  esInformeCompuesto: boolean;
  informeCompuesto?: InformeCompuesto;
  fachadaImages: string[];
  documentosVisuales: DocumentosVisuales;
  hasEdificabilidad: boolean;
  hasGeometria: boolean;
  hasEntorno: boolean;
  hasTroneras: boolean;
  hasAPH: boolean;
  hasLFI: boolean;
  hasLBI: boolean;
}

export enum IndexSectionType {
  CONSIDERACIONES_GENERALES = 'consideraciones_generales',
  DATOS_PARCELA = 'datos_parcela',
  INFORMACION_BASICA = 'informacion_basica',
  DETALLE_ARTICULOS = 'detalle_articulos',
  ZONIFICACION = 'zonificacion',
  ENTORNO = 'entorno',
  CROQUIS_PARCELA = 'croquis_parcela',
  CERTIFICADO_MEDIDAS = 'certificado_medidas',
  INFORMES_APH = 'informes_aph',
  TRAZADO_LO = 'trazado_lo',
  AXONOMETRIA = 'axonometria',
  CALCULO_CAPACIDAD = 'calculo_capacidad',
  IMAGENES_FACHADA = 'imagenes_fachada',
  DOCUMENTOS_VISUALES = 'documentos_visuales',
  CALCULO_PLUSVALIA = 'calculo_plusvalia'
}

export const DYNAMIC_INDEX_CONFIG = {
  BASE_SECTIONS: [
    {
      id: 'consideraciones_generales',
      title: 'CONSIDERACIONES GENERALES',
      shouldInclude: () => true
    },
    {
      id: 'datos_parcela',
      title: 'DATOS DE LA PARCELA',
      shouldInclude: () => true,
      subSections: [
        {
          id: 'informacion_basica',
          title: 'INFORMACIÓN BÁSICA',
          shouldInclude: () => true
        },
        {
          id: 'segun_codigo_urbanistico',
          title: 'SEGÚN CÓDIGO URBANÍSTICO',
          shouldInclude: (informe: Informe) => !!(informe.edificabilidad && Object.keys(informe.edificabilidad).length > 0)
        },
        {
          id: 'restricciones',
          title: 'RESTRICCIONES',
          shouldInclude: (informe: Informe) => !!(informe.entorno?.restricciones?.length > 0 || informe.edificabilidad?.afectaciones)
        },
        {
          id: 'optimizaciones',
          title: 'OPTIMIZACIONES',
          shouldInclude: (informe: Informe, context: IndexGenerationContext) => context.hasTroneras
        },
        {
          id: 'para_calculo_plusvalia',
          title: 'PARA CÁLCULO DE PLUSVALÍA',
          shouldInclude: (informe: Informe) => !!(informe.edificabilidad?.plusvalia)
        }
      ]
    },
    {
      id: 'entorno_fachada',
      title: 'ENTORNO / IMAGEN DE LA FACHADA',
      shouldInclude: (informe: Informe, context: IndexGenerationContext) => context.hasEntorno || context.fachadaImages.length > 0
    },
    {
      id: 'croquis_parcela',
      title: 'CROQUIS DE LA PARCELA',
      shouldInclude: (informe: Informe, context: IndexGenerationContext) => 
        context.documentosVisuales.croquis.length > 0 || !!(informe.edificabilidad?.link_imagen?.croquis_parcela)
    },
    {
      id: 'perimetro_manzana',
      title: 'PERÍMETRO DE LA MANZANA',
      shouldInclude: (informe: Informe, context: IndexGenerationContext) => 
        context.documentosVisuales.perimetros.length > 0 || !!(informe.edificabilidad?.link_imagen?.perimetro_manzana)
    },
    {
      id: 'lbi_lfi',
      title: 'LBI/LFI',
      shouldInclude: (informe: Informe, context: IndexGenerationContext) => context.hasLBI || context.hasLFI
    },
    {
      id: 'plano_indice',
      title: 'PLANO ÍNDICE',
      shouldInclude: (informe: Informe, context: IndexGenerationContext) => 
        context.documentosVisuales.planosIndice.length > 0 || !!(informe.edificabilidad?.link_imagen?.plano_indice)
    },
    {
      id: 'calculo_plusvalia',
      title: 'CÁLCULO DETALLADO DE PLUSVALÍA / DDHUS',
      shouldInclude: (informe: Informe) => !!(informe.edificabilidad?.plusvalia),
      subSections: [
        {
          id: 'calculo_capacidad_constructiva',
          title: 'CÁLCULO DE CAPACIDAD CONSTRUCTIVA',
          shouldInclude: (informe: Informe) => !!(informe.edificabilidad?.sup_edificable_planta)
        },
        {
          id: 'calculo_a1',
          title: 'CÁLCULO DE A1',
          shouldInclude: (informe: Informe) => !!(informe.edificabilidad?.plusvalia)
        },
        {
          id: 'calculo_a2',
          title: 'CÁLCULO DE A2',
          shouldInclude: (informe: Informe) => !!(informe.edificabilidad?.plusvalia)
        },
        {
          id: 'calculo_plusvalia_final',
          title: 'CÁLCULO DE PLUSVALÍA',
          shouldInclude: (informe: Informe) => !!(informe.edificabilidad?.plusvalia)
        }
      ]
    }
  ]
} as const;

export interface SubscriptionPlan {
  _id?: string; // ObjectId
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: readonly string[];
  maxPrefactibilidades?: number;
  isUnlimited?: boolean;
  isRecommended?: boolean;

  // Nuevos campos de créditos y opciones
  creditosMes?: number;
  creditosDia?: number;
  permiteCompuestas?: boolean;
  watermarkOrg?: boolean;
  watermarkPrefas?: boolean;
  freeCredits?: number;
  prioridad?: number;
  tag?: {
    _id: string;
    slug: string;
    name: string;
    bgClass: string;
    icon?: string;
  };
}

export interface PaymentData {
  planId: string;
  email: string;
  amount: number;
  currency: string;
}

export const SUBSCRIPTION_PLANS = [
  {
    id: 'basic',
    name: 'Plan Básico',
    price: 100,
    currency: 'USD',
    interval: 'month',
    maxPrefactibilidades: 5,
    features: [
      'Hasta 5 prefactibilidades mensuales',
      'Personalización completa',
      'Informes en PDF',
      'Soporte por email'
    ]
  },
  {
    id: 'unlimited',
    name: 'Plan Unlimited',
    price: 300,
    currency: 'USD',
    interval: 'month',
    isUnlimited: true,
    isRecommended: true,
    features: [
      'Prefactibilidades ilimitadas',
      'Personalización completa',
      'Informes en PDF',
      'Soporte prioritario',
      'API access'
    ]
  }
] as const satisfies readonly SubscriptionPlan[]; 

// LbiLfiViewerUSIG interfaces
export interface LbiLfiData {
  smp: string;
  coordenadas: {
    lat: number;
    lon: number;
  };
  googleMaps?: {
    lat: string;
    lon: string;
  };
  edificabilidad?: {
    altura_max: number[];
    altura_max_plano_limite: number;
    lfi_disponible?: string;
    longitud_lfi?: string;
  };
  shp_assets_info?: {
    capas?: {
      lib?: {
        features: number;
        datos: GeoJSONFeature[];
      };
      lfi?: {
        features: number;
        datos: GeoJSONFeature[];
      };
    };
    troneras?: {
      calculadas: number;
      datos: TroneraFeature[];
    };
  };
  geometria?: {
    type: string;
    features: GeometriaFeature[];
  };
}

export interface LbiLfiViewerUSIGProps {
  data: LbiLfiData;
  height?: string;
  showControls?: boolean;
  cesiumToken?: string;
  className?: string;
  mapType?: 'OpenStreetMap' | 'satelital' | 'hibrido';
  onElementSelect?: (elementName: string | null) => void;
} 

// Tipo de prefactibilidad seleccionada
export type PrefaType = 'prefa1' | 'prefa2'; 