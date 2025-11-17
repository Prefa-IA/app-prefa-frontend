import * as turf from '@turf/turf';
import L from 'leaflet';

import { GeoJSONFeature, MedicionesCalculadas, TroneraFeature } from '../types/enums';

const geometryToPolygon = (feature: GeoJSONFeature): ReturnType<typeof turf.polygon> | null => {
  try {
    if (feature.geometry.type === 'LineString') {
      const coords = Array.isArray(feature.geometry.coordinates)
        ? [...(feature.geometry.coordinates as number[][])]
        : [];
      if (coords.length >= 3) {
        const first = coords[0];
        const last = coords[coords.length - 1];
        if (first && last && (first[0] !== last[0] || first[1] !== last[1])) {
          coords.push(first);
        }
      }
      return turf.polygon([coords]);
    }
    if (feature.geometry.type === 'Polygon') {
      const coords = feature.geometry.coordinates as number[][][];
      return turf.polygon(coords);
    }
    return null;
  } catch {
    return null;
  }
};

const processLIB = (
  libFeatures: GeoJSONFeature[] | null,
  resultados: MedicionesCalculadas
): void => {
  if (!libFeatures || libFeatures.length === 0 || !libFeatures[0]) return;

  try {
    const libPolygon = geometryToPolygon(libFeatures[0]);
    if (libPolygon) {
      resultados.areaLIB = turf.area(libPolygon);
      const libLine = turf.polygonToLine(libPolygon);
      resultados.perimetroLIB = turf.length(libLine, { units: 'meters' });
    }
  } catch (err) {
    console.error('Error al procesar geometría LIB:', err);
  }
};

const processLFI = (
  lfiFeatures: GeoJSONFeature[] | null,
  resultados: MedicionesCalculadas
): void => {
  if (!lfiFeatures || lfiFeatures.length === 0 || !lfiFeatures[0]) return;

  try {
    const lfiPolygon = geometryToPolygon(lfiFeatures[0]);
    if (lfiPolygon) {
      resultados.areaLFI = turf.area(lfiPolygon);
      const lfiLine = turf.polygonToLine(lfiPolygon);
      resultados.perimetroLFI = turf.length(lfiLine, { units: 'meters' });
    }
  } catch (err) {
    console.error('Error al procesar geometría LFI:', err);
  }
};

const calculateLIBLFIDistance = (
  libFeatures: GeoJSONFeature[] | null,
  lfiFeatures: GeoJSONFeature[] | null,
  resultados: MedicionesCalculadas
): void => {
  if (
    !libFeatures ||
    libFeatures.length === 0 ||
    !libFeatures[0] ||
    !lfiFeatures ||
    lfiFeatures.length === 0 ||
    !lfiFeatures[0]
  ) {
    return;
  }

  try {
    const libFeature = libFeatures[0];
    const lfiFeature = lfiFeatures[0];

    const libCoords = libFeature.geometry.coordinates;
    const lfiCoords = lfiFeature.geometry.coordinates;
    const libPoints: number[][] =
      libFeature.geometry.type === 'LineString' && Array.isArray(libCoords)
        ? [...(libCoords as number[][])]
        : [];
    const lfiPoints: number[][] =
      lfiFeature.geometry.type === 'LineString' && Array.isArray(lfiCoords)
        ? [...(lfiCoords as number[][])]
        : [];

    let minDistance = Infinity;
    for (const libPoint of libPoints) {
      for (const lfiPoint of lfiPoints) {
        const from = turf.point(libPoint);
        const to = turf.point(lfiPoint);
        const distance = turf.distance(from, to, { units: 'meters' });
        minDistance = Math.min(minDistance, distance);
      }
    }

    resultados.distanciaLIB_LFI = minDistance;
  } catch (err) {
    console.error('Error al calcular distancia:', err);
  }
};

export const calcularMetricas = (features: {
  superficieEdificable: GeoJSONFeature[] | null;
  lib: GeoJSONFeature[] | null;
  lfi: GeoJSONFeature[] | null;
  troneras: TroneraFeature[] | null;
}): MedicionesCalculadas => {
  const resultados: MedicionesCalculadas = {};

  try {
    processLIB(features.lib, resultados);
    processLFI(features.lfi, resultados);
    calculateLIBLFIDistance(features.lib, features.lfi, resultados);

    return resultados;
  } catch (err) {
    console.error('Error en cálculos:', err);
    return {};
  }
};

export const calcularMetricasTroneras = (
  troneras: TroneraFeature[]
): { totalTroneras: number; areaTotalTroneras: number } => {
  if (!troneras || troneras.length === 0) {
    return { totalTroneras: 0, areaTotalTroneras: 0 };
  }

  const totalTroneras = troneras.length;
  const areaTotalTroneras = troneras.reduce(
    (sum, tronera) => sum + (tronera.properties.area || 0),
    0
  );

  return { totalTroneras, areaTotalTroneras };
};

export const extraerCoordenadasDeFeatures = (features: GeoJSONFeature[]): number[][] => {
  const coords: number[][] = [];

  features.forEach((feature: GeoJSONFeature) => {
    const geometryCoords = feature.geometry?.coordinates;
    if (geometryCoords && Array.isArray(geometryCoords)) {
      if (feature.geometry.type === 'Polygon') {
        const polygonCoords = geometryCoords as number[][][];
        if (polygonCoords[0] && Array.isArray(polygonCoords[0])) {
          coords.push(...polygonCoords[0]);
        }
      } else if (feature.geometry.type === 'LineString') {
        const lineCoords = geometryCoords as number[][];
        coords.push(...lineCoords);
      }
    }
  });

  return coords;
};

export const extraerCoordenadasDeTroneras = (troneras: TroneraFeature[]): number[][] => {
  const coords: number[][] = [];

  troneras.forEach((feature: TroneraFeature) => {
    const geometryCoords = feature.geometry?.coordinates;
    if (
      geometryCoords &&
      Array.isArray(geometryCoords) &&
      geometryCoords[0] &&
      Array.isArray(geometryCoords[0])
    ) {
      const polygonCoords = geometryCoords as number[][][];
      const firstRing = polygonCoords[0];
      if (firstRing) {
        coords.push(...firstRing);
      }
    }
  });

  return coords;
};

export const calcularBounds = (allCoords: number[][]): L.LatLngBounds | null => {
  if (allCoords.length === 0) return null;

  const lats = allCoords
    .map((coord) => coord?.[1])
    .filter((lat): lat is number => lat !== undefined);
  const lons = allCoords
    .map((coord) => coord?.[0])
    .filter((lon): lon is number => lon !== undefined);

  if (lats.length === 0 || lons.length === 0) return null;

  return L.latLngBounds([
    [Math.min(...lats), Math.min(...lons)],
    [Math.max(...lats), Math.max(...lons)],
  ]);
};
