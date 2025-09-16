import * as turf from '@turf/turf';
import L from 'leaflet';
import { GeoJSONFeature, TroneraFeature, MedicionesCalculadas, GeoJSONDataState } from '../types/enums';

export const calcularMetricas = (features: {
  superficieEdificable: GeoJSONFeature[] | null;
  lib: GeoJSONFeature[] | null;
  lfi: GeoJSONFeature[] | null;
  troneras: TroneraFeature[] | null;
}): MedicionesCalculadas => {
  const resultados: MedicionesCalculadas = {};

  try {
    // Cálculos para LIB
    if (features.lib && features.lib.length > 0) {
      let libPolygon;

      try {
        if (features.lib[0].geometry.type === "LineString") {
          const coords = [...features.lib[0].geometry.coordinates];
          if (coords.length >= 3 && (coords[0][0] !== coords[coords.length - 1][0] || coords[0][1] !== coords[coords.length - 1][1])) {
            coords.push(coords[0]);
          }
          libPolygon = turf.polygon([coords]);
        } else if (features.lib[0].geometry.type === "Polygon") {
          libPolygon = turf.polygon(features.lib[0].geometry.coordinates);
        }

        if (libPolygon) {
          resultados.areaLIB = turf.area(libPolygon);
          const libLine = turf.polygonToLine(libPolygon);
          resultados.perimetroLIB = turf.length(libLine, { units: 'meters' });
        }
      } catch (err) {
        console.error("Error al procesar geometría LIB:", err);
      }
    }

    // Cálculos para LFI
    if (features.lfi && features.lfi.length > 0) {
      let lfiPolygon;

      try {
        if (features.lfi[0].geometry.type === "LineString") {
          const coords = [...features.lfi[0].geometry.coordinates];
          if (coords.length >= 3 && (coords[0][0] !== coords[coords.length - 1][0] || coords[0][1] !== coords[coords.length - 1][1])) {
            coords.push(coords[0]);
          }
          lfiPolygon = turf.polygon([coords]);
        } else if (features.lfi[0].geometry.type === "Polygon") {
          lfiPolygon = turf.polygon(features.lfi[0].geometry.coordinates);
        }

        if (lfiPolygon) {
          resultados.areaLFI = turf.area(lfiPolygon);
          const lfiLine = turf.polygonToLine(lfiPolygon);
          resultados.perimetroLFI = turf.length(lfiLine, { units: 'meters' });
        }
      } catch (err) {
        console.error("Error al procesar geometría LFI:", err);
      }
    }

    // Cálculo de distancia LIB-LFI
    if (features.lib && features.lib.length > 0 && features.lfi && features.lfi.length > 0) {
      try {
        let libPoints: number[][] = [];
        let lfiPoints: number[][] = [];

        if (features.lib[0].geometry.type === "LineString") {
          libPoints = [...features.lib[0].geometry.coordinates];
        }

        if (features.lfi[0].geometry.type === "LineString") {
          lfiPoints = [...features.lfi[0].geometry.coordinates];
        }

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
        console.error("Error al calcular distancia:", err);
      }
    }

    return resultados;
  } catch (err) {
    console.error("Error en cálculos:", err);
    return {};
  }
};

export const calcularMetricasTroneras = (troneras: TroneraFeature[]): { totalTroneras: number; areaTotalTroneras: number } => {
  if (!troneras || troneras.length === 0) {
    return { totalTroneras: 0, areaTotalTroneras: 0 };
  }

  const totalTroneras = troneras.length;
  const areaTotalTroneras = troneras.reduce((sum, tronera) => 
    sum + (tronera.properties.area || 0), 0
  );

  return { totalTroneras, areaTotalTroneras };
};

export const extraerCoordenadasDeFeatures = (features: GeoJSONFeature[]): number[][] => {
  const coords: number[][] = [];
  
  features.forEach((feature: GeoJSONFeature) => {
    if (feature.geometry?.coordinates) {
      if (feature.geometry.type === "Polygon" && feature.geometry.coordinates[0]) {
        coords.push(...feature.geometry.coordinates[0]);
      } else if (feature.geometry.type === "LineString") {
        coords.push(...feature.geometry.coordinates);
      }
    }
  });

  return coords;
};

export const extraerCoordenadasDeTroneras = (troneras: TroneraFeature[]): number[][] => {
  const coords: number[][] = [];
  
  troneras.forEach((feature: TroneraFeature) => {
    if (feature.geometry?.coordinates?.[0]) {
      coords.push(...feature.geometry.coordinates[0]);
    }
  });

  return coords;
};

export const calcularBounds = (allCoords: number[][]): L.LatLngBounds | null => {
  if (allCoords.length === 0) return null;

  const lats = allCoords.map(coord => coord[1]);
  const lons = allCoords.map(coord => coord[0]);
  
  return L.latLngBounds([
    [Math.min(...lats), Math.min(...lons)],
    [Math.max(...lats), Math.max(...lons)]
  ]);
}; 