declare module '@usig-gcba/mapa-interactivo' {
  interface MapaInteractivoOptions {
    onClick?: (event: unknown) => void;
    onContextMenu?: (event: unknown) => void;
    onMoveStart?: (event: unknown) => void;
    onMoveEnd?: (event: unknown) => void;
    onMarkerDragEnd?: (event: unknown) => void;
    onFeatureClick?: (event: unknown) => void;
    onInactivateMarker?: (event: unknown) => void;
    center?: [number, number];
    zoomControl?: boolean;
    zoom?: number;
    touchZoom?: boolean;
    tap?: boolean;
    attributionControl?: boolean;
    markerZoomInLevel?: number;
    featureZoomInLevel?: number;
    language?: string;
    fromMarker?: unknown;
    toMarker?: unknown;
    activeMarker?: unknown;
    marker?: unknown;
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

    getMapa(): unknown;
    addPublicLayer(layerName: string, options?: Record<string, unknown>): void;
    removePublicLayer(layerName: string): void;
    addVectorTileLayer(layerId: string, options?: Record<string, unknown>): void;
    removeVectorTileLayer(layerId: string): void;
    setBaseLayer(baseLayer?: unknown): void;
    addMarker(
      latlng: LatLng,
      visible: boolean,
      draggable: boolean,
      goTo: boolean,
      activate: boolean,
      clickable: boolean,
      options: Record<string, unknown>
    ): number;
    selectMarker(markerId: number): void;
    isMarkerActive(markerId: number): boolean;
    removeMarker(markerId: number): void;
    addLocationMarker(position: unknown, recenter: boolean, zoomIn: boolean): unknown;
    mostrarRecorrido(recorrido: unknown): void;
    ocultarRecorrido(recorrido: unknown): void;
    getStaticImage(): Promise<HTMLCanvasElement>;
  }

  export default MapaInteractivo;
}
