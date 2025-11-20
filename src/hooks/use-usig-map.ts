import { useRef } from 'react';

import { useUsigMapInitialization } from './use-usig-map-initialization';
import { useUsigMapMarker } from './use-usig-map-marker';

interface UseUsigMapProps {
  center: { lat: number; lng: number };
  showMarker?: boolean;
}

export const useUsigMap = ({ center, showMarker = true }: UseUsigMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const initialCenterRef = useRef(center);
  const initialShowMarkerRef = useRef(showMarker);

  const { mapaInteractivoRef, isLoaded, markerIdRef } = useUsigMapInitialization({
    mapRef,
    initialCenter: initialCenterRef.current,
    initialShowMarker: initialShowMarkerRef.current,
  });

  useUsigMapMarker({
    mapaInteractivoRef,
    markerIdRef,
    center,
    showMarker,
    isLoaded,
  });

  return {
    mapRef,
    isLoaded,
    mapaInteractivo: mapaInteractivoRef.current,
  };
};

export default useUsigMap;
