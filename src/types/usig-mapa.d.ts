declare module '@usig-gcba/mapa-interactivo' {
  interface MapaInteractivoOptions {
    onClick?: (event: any) => void;
    onContextMenu?: (event: any) => void;
    onMoveStart?: (event: any) => void;
    onMoveEnd?: (event: any) => void;
    onMarkerDragEnd?: (event: any) => void;
    onFeatureClick?: (event: any) => void;
    onInactivateMarker?: (event: any) => void;
    center?: [number, number];
    zoomControl?: boolean;
    zoom?: number;
    touchZoom?: boolean;
    tap?: boolean;
    attributionControl?: boolean;
    markerZoomInLevel?: number;
    featureZoomInLevel?: number;
    language?: string;
    fromMarker?: any;
    toMarker?: any;
    activeMarker?: any;
    marker?: any;
    baseLayer?: {
      params?: {
        maxZoom?: number;
        minZoom?: number;
      };
    };
    texts?: {
      es?: {
        loadingLayers?: string;
        loadingMaps?: string;
        loadingInformation?: string;
        errorLoadingInformation?: string;
      };
      en?: {
        loadingLayers?: string;
        loadingMaps?: string;
        loadingInformation?: string;
        errorLoadingInformation?: string;
      };
    };
  }

  interface LatLng {
    lat: number;
    lng: number;
  }

  class MapaInteractivo {
    constructor(id: string, options?: MapaInteractivoOptions);
    
    getMapa(): any;
    addPublicLayer(layerName: string, options?: any): void;
    removePublicLayer(layerName: string): void;
    addVectorTileLayer(layerId: string, options?: any): void;
    removeVectorTileLayer(layerId: string): void;
    setBaseLayer(baseLayer?: any): void;
    addMarker(
      latlng: LatLng,
      visible: boolean,
      draggable: boolean,
      goTo: boolean,
      activate: boolean,
      clickable: boolean,
      options: any
    ): number;
    selectMarker(markerId: number): void;
    isMarkerActive(markerId: number): boolean;
    removeMarker(markerId: number): void;
    addLocationMarker(position: any, recenter: boolean, zoomIn: boolean): any;
    mostrarRecorrido(recorrido: any): void;
    ocultarRecorrido(recorrido: any): void;
    getStaticImage(): Promise<HTMLCanvasElement>;
  }

  export default MapaInteractivo;
} 