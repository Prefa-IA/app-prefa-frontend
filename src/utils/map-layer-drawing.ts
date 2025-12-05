import maplibregl, { Map } from 'maplibre-gl';

import { MapData } from '../types/components';

import { addOrUpdateLayer, extendBounds } from './map-layer-helpers';

export const drawParcelaLayers = (
  map: Map,
  parcela: GeoJSON.FeatureCollection | undefined
): void => {
  if (parcela && parcela.features && parcela.features.length > 0) {
    parcela.features.forEach((feat, idx) => {
      const featCollection = {
        type: 'FeatureCollection',
        features: [feat],
      } as GeoJSON.FeatureCollection;
      addOrUpdateLayer(map, `parcela-${idx}`, featCollection, {
        type: 'fill',
        paint: {
          'fill-color': '#FFD700',
          'fill-opacity': 0.4,
        },
      });
    });
  }
};

export const drawAfectacionesLayers = (map: Map, afectaciones: MapData['afectaciones']): void => {
  if (afectaciones?.parcela_afectada_lfi) {
    const parcelaAfectadaLfi = {
      type: 'FeatureCollection' as const,
      features: [afectaciones.parcela_afectada_lfi],
    };
    addOrUpdateLayer(map, 'parcela-afectada-lfi', parcelaAfectadaLfi, {
      type: 'fill',
      paint: {
        'fill-color': '#FFD700',
        'fill-opacity': 1,
      },
    });
  }

  if (afectaciones?.parcela_afectada_lib) {
    const parcelaAfectadaLib = {
      type: 'FeatureCollection' as const,
      features: [afectaciones.parcela_afectada_lib],
    };
    addOrUpdateLayer(map, 'parcela-afectada-lib', parcelaAfectadaLib, {
      type: 'fill',
      paint: {
        'fill-color': '#FFD700',
        'fill-opacity': 0.3,
      },
    });
  }
};

export const drawLIBLFILayers = (
  map: Map,
  lib: GeoJSON.FeatureCollection | null | undefined,
  lfi: GeoJSON.FeatureCollection | null | undefined
): void => {
  if (lib && lib.features && lib.features.length > 0) {
    addOrUpdateLayer(map, 'lib', lib, {
      type: 'line',
      paint: {
        'line-color': '#FF6600',
        'line-width': 3,
      },
    });
  }

  if (lfi && lfi.features && lfi.features.length > 0) {
    addOrUpdateLayer(map, 'lfi', lfi, {
      type: 'line',
      paint: {
        'line-color': '#0066CC',
        'line-width': 3,
      },
    });
  }
};

export const calculateMapBounds = (data: MapData | null): maplibregl.LngLatBounds | null => {
  if (!data) return null;

  const bounds = new maplibregl.LngLatBounds();

  if (data.lib && data.lib.features) {
    data.lib.features.forEach((f) => {
      if (f.geometry && 'coordinates' in f.geometry) {
        extendBounds(bounds, f.geometry.coordinates as Parameters<typeof extendBounds>[1]);
      }
    });
  }
  if (data.lfi && data.lfi.features) {
    data.lfi.features.forEach((f) => {
      if (f.geometry && 'coordinates' in f.geometry) {
        extendBounds(bounds, f.geometry.coordinates as Parameters<typeof extendBounds>[1]);
      }
    });
  }
  if (data.parcela && data.parcela.features) {
    data.parcela.features.forEach((f) => {
      if (f.geometry && 'coordinates' in f.geometry) {
        extendBounds(bounds, f.geometry.coordinates as Parameters<typeof extendBounds>[1]);
      }
    });
  }

  return bounds.isEmpty() ? null : bounds;
};
