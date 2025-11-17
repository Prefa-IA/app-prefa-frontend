import { useEffect, useRef, useState } from 'react';
import MapaInteractivo from '@usig-gcba/mapa-interactivo';

interface UseUsigMapProps {
  center: { lat: number; lng: number };
  showMarker?: boolean;
}

export const useUsigMap = ({ center, showMarker = true }: UseUsigMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapaInteractivoRef = useRef<MapaInteractivo | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const markerIdRef = useRef<number | null>(null);
  const initialCenterRef = useRef(center);
  const initialShowMarkerRef = useRef(showMarker);

  useEffect(() => {
    if (!mapRef.current) return;

    let mounted = true;

    const initializeMap = async () => {
      try {
        // Pequeño delay para asegurar que el DOM esté listo
        await new Promise((resolve) => setTimeout(resolve, 100));

        if (!mounted || !mapRef.current) return;

        // Crear instancia del mapa interactivo con configuración simplificada
        const mapaInteractivo = new MapaInteractivo(mapRef.current.id, {
          center: [initialCenterRef.current.lat, initialCenterRef.current.lng],
          zoom: 18, // Zoom alto para búsquedas
          zoomControl: true,
          touchZoom: true,
          tap: true,
          attributionControl: false,
          language: 'es',
          markerZoomInLevel: 18, // Zoom alto cuando se agrega marcador
        });

        if (!mounted) return;

        mapaInteractivoRef.current = mapaInteractivo;
        setIsLoaded(true);

        // Agregar marcador si se requiere
        if (initialShowMarkerRef.current) {
          const markerId = mapaInteractivo.addMarker(
            { lat: initialCenterRef.current.lat, lng: initialCenterRef.current.lng },
            true, // visible
            false, // draggable
            false, // goTo
            true, // activate
            false, // clickable
            {} // options
          );
          markerIdRef.current = markerId;
        }
      } catch (error) {
        console.error('Error al inicializar el mapa:', error);
        if (mounted) {
          setIsLoaded(false);
        }
      }
    };

    void initializeMap();

    // Cleanup
    return () => {
      mounted = false;
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
  }, []); // Solo inicializar una vez

  // Actualizar posición del marcador cuando cambie el centro
  useEffect(() => {
    if (!mapaInteractivoRef.current || !isLoaded) return;

    try {
      // Remover marcador anterior si existe
      if (markerIdRef.current !== null) {
        mapaInteractivoRef.current.removeMarker(markerIdRef.current);
      }

      // Agregar nuevo marcador si se requiere
      if (showMarker) {
        const markerId = mapaInteractivoRef.current.addMarker(
          { lat: center.lat, lng: center.lng },
          true, // visible
          false, // draggable
          true, // goTo (recentrar en el nuevo marcador)
          true, // activate
          false, // clickable
          {} // options
        );
        markerIdRef.current = markerId;
      }
    } catch (error) {
      console.error('Error al actualizar marcador:', error);
    }
  }, [center.lat, center.lng, showMarker, isLoaded]);

  return {
    mapRef,
    isLoaded,
    mapaInteractivo: mapaInteractivoRef.current,
  };
};

export default useUsigMap;
