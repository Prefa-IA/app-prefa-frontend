export * from './types/enums';

export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  tipo: 'individual' | 'empresa';
  consultasDisponibles?: number;
  suscripcion?: {
    fechaFin: string;
    tipo: 'mensual' | 'anual' | 'basica';
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegistroData {
  email: string;
  password: string;
  nombre: string;
  tipo: 'individual' | 'empresa';
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

interface GeometriaFeature {
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
  };
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
  googleMaps: Coordenadas;
  direccion: DireccionData;
  direccionesNormalizadas: DireccionData[];
  datosCatastrales: DatosCatastrales;
  datosUtiles: DatosUtiles;
  geometria: Geometria;
  edificabilidad: Edificabilidad;
  entorno: Entorno;
  timestamp: string;
}

export interface InformeCompuesto {
  direcciones: string[];
  informesIndividuales: Informe[];
  informeConsolidado: Informe;
} 