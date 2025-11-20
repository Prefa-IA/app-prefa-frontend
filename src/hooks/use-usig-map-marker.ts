import { MutableRefObject, RefObject, useEffect } from 'react';
import MapaInteractivo from '@usig-gcba/mapa-interactivo';

interface UseUsigMapMarkerProps {
  mapaInteractivoRef: RefObject<MapaInteractivo | null>;
  markerIdRef: MutableRefObject<number | null>;
  center: { lat: number; lng: number };
  showMarker: boolean;
  isLoaded: boolean;
}

const tryCenterMap = (
  mapaInteractivo: MapaInteractivo,
  center: { lat: number; lng: number }
): void => {
  try {
    const mapa = mapaInteractivo as unknown as {
      _map?: { setView: (center: [number, number], zoom?: number) => void };
      map?: { setView: (center: [number, number], zoom?: number) => void };
      leafletMap?: { setView: (center: [number, number], zoom?: number) => void };
    };

    if (mapa._map?.setView) {
      mapa._map.setView([center.lat, center.lng], 18);
    } else if (mapa.map?.setView) {
      mapa.map.setView([center.lat, center.lng], 18);
    } else if (mapa.leafletMap?.setView) {
      mapa.leafletMap.setView([center.lat, center.lng], 18);
    }
  } catch {
    // Ignorar errores al intentar centrar el mapa
  }
};

export const useUsigMapMarker = ({
  mapaInteractivoRef,
  markerIdRef,
  center,
  showMarker,
  isLoaded,
}: UseUsigMapMarkerProps) => {
  useEffect(() => {
    if (!mapaInteractivoRef.current || !isLoaded) return;

    try {
      if (markerIdRef.current !== null) {
        mapaInteractivoRef.current.removeMarker(markerIdRef.current);
        markerIdRef.current = null;
      }

      if (showMarker) {
        const markerId = mapaInteractivoRef.current.addMarker(
          { lat: center.lat, lng: center.lng },
          true,
          false,
          true,
          true,
          false,
          {}
        );
        markerIdRef.current = markerId;
      }

      tryCenterMap(mapaInteractivoRef.current, center);
    } catch (error) {
      console.error('Error al actualizar marcador:', error);
    }
  }, [center, showMarker, isLoaded, mapaInteractivoRef, markerIdRef]);
};
