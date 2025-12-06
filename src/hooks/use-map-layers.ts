import { useCallback, useRef } from 'react';
import { Map } from 'maplibre-gl';

import { MapData } from '../types/components';
import { Geometria } from '../types/enums';
import {
  calculateMapBounds,
  drawAfectacionesLayers,
  drawLIBLFILayers,
  drawParcelaLayers,
} from '../utils/map-layer-drawing';

interface UseMapLayersProps {
  mapRef: React.MutableRefObject<Map | null>;
  mapDataRef: React.MutableRefObject<MapData | null>;
  centro: { lat: number; lon: number };
  geometriaParcela?: Geometria | undefined;
}

const convertGeometriaToFeatureCollection = (
  geometria: Geometria | undefined
): GeoJSON.FeatureCollection | undefined => {
  if (!geometria) return undefined;

  if (!Array.isArray(geometria.features) || geometria.features.length === 0) {
    return undefined;
  }

  return {
    type: 'FeatureCollection',
    features: geometria.features.map((f) => ({
      type: 'Feature',
      geometry: f.geometry as unknown as GeoJSON.Geometry,
      properties: f.properties || {},
    })),
  } as GeoJSON.FeatureCollection;
};

const getParcelaToDraw = (
  data: MapData | null,
  geometriaParcela: Geometria | undefined
): GeoJSON.FeatureCollection | undefined => {
  if (
    data?.parcela &&
    data.parcela.features &&
    Array.isArray(data.parcela.features) &&
    data.parcela.features.length > 0
  ) {
    return data.parcela;
  }

  if (
    geometriaParcela &&
    geometriaParcela.features &&
    Array.isArray(geometriaParcela.features) &&
    geometriaParcela.features.length > 0
  ) {
    const parcelaFromInforme = convertGeometriaToFeatureCollection(geometriaParcela);
    if (parcelaFromInforme) {
      return parcelaFromInforme;
    }
  }

  return undefined;
};

const getBoundsData = (
  data: MapData | null,
  parcelaToDraw: GeoJSON.FeatureCollection | undefined
): MapData | null => {
  if (data) return data;
  if (parcelaToDraw) {
    return {
      parcela: parcelaToDraw,
      lib: null,
      lfi: null,
      afectaciones: null,
    } as MapData;
  }
  return null;
};

export const useMapLayers = ({
  mapRef,
  mapDataRef,
  centro,
  geometriaParcela,
}: UseMapLayersProps) => {
  const lastWarningTimeRef = useRef<number>(0);
  const WARNING_THROTTLE_MS = 2000;

  const drawLayers = useCallback(() => {
    const map = mapRef.current;

    if (!map || !map.isStyleLoaded()) {
      const now = Date.now();
      if (now - lastWarningTimeRef.current > WARNING_THROTTLE_MS) {
        lastWarningTimeRef.current = now;
        console.debug('Mapa no está listo para dibujar capas.');
      }
      return;
    }

    const data = mapDataRef.current;
    const parcelaToDraw = getParcelaToDraw(data, geometriaParcela);

    drawParcelaLayers(map, parcelaToDraw);

    if (data) {
      drawAfectacionesLayers(map, data.afectaciones);
      if (data.lib || data.lfi) {
        drawLIBLFILayers(map, data.lib || undefined, data.lfi || undefined);
      }
    }

    const boundsData = getBoundsData(data, parcelaToDraw);
    const bounds = calculateMapBounds(boundsData);

    if (bounds) {
      map.fitBounds(bounds, { padding: 50, maxZoom: 18, duration: 0 });
    } else {
      map.flyTo({ center: [centro.lon, centro.lat], zoom: 18, duration: 0 });
    }
  }, [mapRef, mapDataRef, centro, geometriaParcela]);

  return { drawLayers };
};
/* prettier-ignore */
