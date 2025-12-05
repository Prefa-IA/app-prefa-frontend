import { useEffect, useRef, useState } from 'react';
import MapaInteractivo from '@usig-gcba/mapa-interactivo';

interface UseUsigMapInitializationProps {
  mapRef: React.RefObject<HTMLDivElement>;
  initialCenter: { lat: number; lng: number };
  initialShowMarker: boolean;
}

export const useUsigMapInitialization = ({
  mapRef,
  initialCenter,
  initialShowMarker,
}: UseUsigMapInitializationProps) => {
  const mapaInteractivoRef = useRef<MapaInteractivo | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const markerIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const mountedRef = { current: true };

    const initializeMap = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 100));

        if (!mountedRef.current || !mapRef.current) return;

        const mapaInteractivo = new MapaInteractivo(mapRef.current.id, {
          center: [initialCenter.lat, initialCenter.lng],
          zoom: 18,
          zoomControl: true,
          touchZoom: true,
          tap: true,
          attributionControl: false,
          language: 'es',
          markerZoomInLevel: 18,
        });

        if (!mountedRef.current) return;

        mapaInteractivoRef.current = mapaInteractivo;
        setIsLoaded(true);

        if (initialShowMarker) {
          const markerId = mapaInteractivo.addMarker(
            { lat: initialCenter.lat, lng: initialCenter.lng },
            true,
            false,
            true,
            true,
            false,
            {}
          );
          markerIdRef.current = markerId;
        }
      } catch (error) {
        console.error('Error al inicializar el mapa:', error);
        if (mountedRef.current) {
          setIsLoaded(false);
        }
      }
    };

    void initializeMap();

    return () => {
      mountedRef.current = false;
      if (mapaInteractivoRef.current && markerIdRef.current !== null) {
        try {
          mapaInteractivoRef.current.removeMarker(markerIdRef.current);
        } catch (error) {
          console.error('Error al limpiar el mapa:', error);
        }
      }
      mapaInteractivoRef.current = null;
      setIsLoaded(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { mapaInteractivoRef, isLoaded, markerIdRef };
};
