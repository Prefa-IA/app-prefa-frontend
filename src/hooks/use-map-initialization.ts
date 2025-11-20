import React, { useEffect } from 'react';
import maplibregl, { Map } from 'maplibre-gl';

import { Coordinates } from '../utils/map-utils';

interface UseMapInitializationProps {
  mapContainer: React.RefObject<HTMLDivElement>;
  mapRef: React.MutableRefObject<Map | null>;
  isMapLoadedRef: React.MutableRefObject<boolean>;
  isMountedRef: React.MutableRefObject<boolean>;
  centro: Coordinates;
  onMapLoad: () => void;
}

export const useMapInitialization = ({
  mapContainer,
  mapRef,
  isMapLoadedRef,
  isMountedRef,
  centro,
  onMapLoad,
}: UseMapInitializationProps) => {
  const onMapLoadRef = React.useRef(onMapLoad);
  const initializedRef = React.useRef(false);

  React.useEffect(() => {
    onMapLoadRef.current = onMapLoad;
  }, [onMapLoad]);

  useEffect(() => {
    if (mapRef.current || !mapContainer.current || initializedRef.current) return;

    const pickStyleUrl = async (): Promise<string> => {
      const demotiles = 'https://demotiles.maplibre.org/style.json';
      const key = process.env['REACT_APP_MAPTILER_KEY'] || 'BvZtXULr9szx4d76ddiF';
      const styleEnv = process.env['REACT_APP_MAP_STYLE_URL'];
      const primary = styleEnv || `https://api.maptiler.com/maps/dataviz/style.json?key=${key}`;
      try {
        const res = await fetch(primary, { method: 'HEAD' });
        if (res.ok) return primary;
      } catch (_e) {}
      return demotiles;
    };

    initializedRef.current = true;
    isMountedRef.current = true;
    void (async () => {
      const styleUrl = await pickStyleUrl();
      if (!isMountedRef.current) {
        initializedRef.current = false;
        return;
      }
      const map = new maplibregl.Map({
        container: mapContainer.current as HTMLDivElement,
        style: styleUrl,
        center: [
          (centro as { lon?: number; lng?: number }).lon ?? (centro as { lng: number }).lng,
          centro.lat,
        ],
        zoom: 17,
      });

      mapRef.current = map;

      map.on('load', () => {
        isMapLoadedRef.current = true;
        onMapLoadRef.current();
      });
    })();

    return () => {
      initializedRef.current = false;
      isMountedRef.current = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      isMapLoadedRef.current = false;
    };
  }, [centro, mapContainer, mapRef, isMapLoadedRef, isMountedRef]);
};
