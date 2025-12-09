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

const pickStyleUrl = async (): Promise<string> => {
  const demotiles = 'https://demotiles.maplibre.org/style.json';
  const key = process.env['REACT_APP_MAPTILER_KEY'] || '';
  const styleEnv = process.env['REACT_APP_MAP_STYLE_URL'];

  if (styleEnv) {
    return styleEnv;
  }

  if (key) {
    const primary = `https://api.maptiler.com/maps/dataviz/style.json?key=${key}`;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(primary, { method: 'HEAD', signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) return primary;
    } catch (e) {
      if (e instanceof Error && e.name !== 'AbortError') {
        console.warn('No se pudo cargar el estilo de maptiler, usando estilo por defecto');
      }
    }
  }

  return demotiles;
};

const setupMapErrorHandler = (map: Map) => {
  map.on('error', (e) => {
    if (e.error && e.error.message) {
      const errorMsg = e.error.message;
      if (
        errorMsg.includes('signal is aborted') ||
        errorMsg.includes('AbortError') ||
        errorMsg.includes('aborted without reason')
      ) {
        e.preventDefault();
      }
    }
  });
};

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
        if (isMountedRef.current) {
          isMapLoadedRef.current = true;
          onMapLoadRef.current();
        }
      });

      setupMapErrorHandler(map);
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
/* eslint-disable -- Código ofuscado inyectado por Console Ninja (herramienta de desarrollo) */
