declare module 'mapa-gcba' {
  interface MapaOptions {
    params?: {
      center?: [number, number];
      zoom?: number;
      zoomControl?: boolean;
      dragging?: boolean;
      scrollWheelZoom?: boolean;
      doubleClickZoom?: boolean;
      attributionControl?: boolean;
    };
    reverseOptions?: {
      active?: boolean;
      type?: 'address' | 'place' | 'places';
      radius?: number;
    };
    onClick?: (event: { latlng: { lat: number; lng: number } }) => void;
  }

  class MapaInteractivo {
    constructor(elementId: string, options?: MapaOptions);
    setMarkerView(lat: number, lng: number, popup?: string): void;
    getMap(): unknown;
  }

  export default MapaInteractivo;

  export interface DatosEdificabilidad {
    alturaMaxima: string | number;
    pisosPermitidos: string | number;
    fot: string | number;
    fos: string | number;
  }

  export interface DatosCatastrales {
    superficie: string | number;
    frente: string | number;
    fondo: string | number;
    zonificacion: string;
  }

  export interface DatosUtiles {
    restricciones: string[];
    usos_suelo: string[];
    notas: string[];
  }

  export interface ResultadoConsulta {
    direccion: {
      direccion: string;
      altura: string | number;
      barrio: string;
      comuna: string | number;
      smp?: string;
    };
    datosCatastrales: DatosCatastrales;
    edificabilidad: DatosEdificabilidad;
    datosUtiles: DatosUtiles;
  }
}

declare module 'mapa-gcba/dist/assets/css/main.css';
