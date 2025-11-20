import * as turf from '@turf/turf';

import { GeoJSONFeature, MedicionesCalculadas } from '../types/enums';

export const validateLIBLFIFeatures = (
  libFeatures: GeoJSONFeature[] | null,
  lfiFeatures: GeoJSONFeature[] | null
): boolean => {
  return !!(
    libFeatures &&
    libFeatures.length > 0 &&
    libFeatures[0] &&
    lfiFeatures &&
    lfiFeatures.length > 0 &&
    lfiFeatures[0]
  );
};

export const extractLineStringPoints = (feature: GeoJSONFeature): number[][] => {
  const coords = feature.geometry.coordinates;
  return feature.geometry.type === 'LineString' && Array.isArray(coords)
    ? [...(coords as number[][])]
    : [];
};

export const calculateMinDistance = (libPoints: number[][], lfiPoints: number[][]): number => {
  const distances = libPoints.flatMap((libPoint) =>
    lfiPoints.map((lfiPoint) => {
      const from = turf.point(libPoint);
      const to = turf.point(lfiPoint);
      return turf.distance(from, to, { units: 'meters' });
    })
  );
  return distances.length > 0 ? Math.min(...distances) : Infinity;
};

export const calculateLIBLFIDistance = (
  libFeatures: GeoJSONFeature[] | null,
  lfiFeatures: GeoJSONFeature[] | null,
  resultados: MedicionesCalculadas
): void => {
  if (!validateLIBLFIFeatures(libFeatures, lfiFeatures)) {
    return;
  }

  try {
    const libFeature = libFeatures?.[0];
    const lfiFeature = lfiFeatures?.[0];

    if (!libFeature || !lfiFeature) {
      return;
    }

    const libPoints = extractLineStringPoints(libFeature);
    const lfiPoints = extractLineStringPoints(lfiFeature);

    const minDistance = calculateMinDistance(libPoints, lfiPoints);
    resultados.distanciaLIB_LFI = minDistance;
  } catch (err) {
    console.error('Error al calcular distancia:', err);
  }
};
