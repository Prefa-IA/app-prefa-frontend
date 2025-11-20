import * as geojson from 'geojson';
import L from 'leaflet';

import { GeoJSONData, GeoJSONFeature, TroneraFeature } from '../types/enums';

import { buildAPHPopupContent, getProteccionInfo } from './aph-helpers';
import { extraerCoordenadasDeFeatures, extraerCoordenadasDeTroneras } from './geo-calculations';
import { crear3DEffect, crearAPHEffect, getMapStyles } from './map-styles';

export const clearMapLayers = (mapInstance: L.Map): void => {
  mapInstance.eachLayer((layer) => {
    if (layer instanceof L.TileLayer) return;
    if (layer instanceof L.Marker) return;
    mapInstance.removeLayer(layer);
  });
};

export const addManzanasLayer = (mapInstance: L.Map, features: GeoJSONFeature[]): number[][] => {
  const styles = getMapStyles();
  const manzanasData: GeoJSONData = { type: 'FeatureCollection', features };

  L.geoJSON(manzanasData as unknown as geojson.GeoJsonObject, {
    style: styles.mapaManzanas,
    onEachFeature: (feature, layer) => {
      if (feature.properties) {
        const popupContent = `<div><strong>🏘️ Manzana</strong><br>
          <strong>ID:</strong> ${feature.properties.id || 'N/A'}<br>
          <strong>Sector-Manzana:</strong> ${feature.properties.sm || 'N/A'}<br>
          <strong>Tipo:</strong> ${feature.properties.tipo || 'N/A'}<br>
        </div>`;
        layer.bindPopup(popupContent);
      }
    },
  }).addTo(mapInstance);

  return extraerCoordenadasDeFeatures(features);
};

export const addTejidoLayer = (mapInstance: L.Map, features: GeoJSONFeature[]): number[][] => {
  const tejidoData: GeoJSONData = { type: 'FeatureCollection', features };

  const getAlturaColor = (altura: number): string => {
    if (altura > 20) return '#DC2626';
    if (altura > 10) return '#F59E0B';
    return '#10B981';
  };

  const getConsolidacionColor = (consolidacion: number): string => {
    if (consolidacion > 0.7) return '#10B981';
    if (consolidacion > 0.4) return '#F59E0B';
    return '#DC2626';
  };

  const getCategoriaEdificio = (altura: number): string => {
    if (altura > 30) return 'Torre';
    if (altura > 15) return 'Edificio alto';
    if (altura > 8) return 'Edificio medio';
    return 'Edificio bajo';
  };

  interface TejidoProperties {
    altura?: number;
    altos?: number;
    consolidad?: number;
    smp?: string;
    tipo?: string;
    origen?: string;
    fuente?: string;
  }

  const buildPopupContent = (properties: TejidoProperties): string => {
    const altura = properties.altura || 0;
    const altos = properties.altos || 0;
    const consolidacion = properties.consolidad || 0;
    const categoria = altura > 0 ? getCategoriaEdificio(altura) : null;

    return `<div><strong>🏢 Tejido Urbano 3D</strong><br>
      <strong>SMP:</strong> ${properties.smp || 'N/A'}<br>
      <strong>📏 Altura:</strong> <span style="color: ${getAlturaColor(altura)}">${altura}m</span><br>
      <strong>🏗️ Pisos:</strong> ${altos}<br>
      <strong>🏛️ Tipo:</strong> ${properties.tipo || 'N/A'}<br>
      <strong>📊 Consolidación:</strong> <span style="color: ${getConsolidacionColor(consolidacion)}">${consolidacion}</span><br>
      <strong>📍 Origen:</strong> ${properties.origen || 'N/A'}<br>
      <strong>📋 Fuente:</strong> ${properties.fuente || 'N/A'}<br>
      ${categoria ? `<strong>🏗️ Categoría:</strong> <span style="color: #3B82F6">${categoria}</span><br>` : ''}
    </div>`;
  };

  L.geoJSON(tejidoData as unknown as geojson.GeoJsonObject, {
    style: (feature) => {
      const altura = feature?.properties?.altura || 0;
      const tipo = feature?.properties?.tipo || 'edificio';
      return crear3DEffect(altura, tipo);
    },
    onEachFeature: (feature, layer) => {
      if (feature.properties) {
        const altura = feature.properties.altura || 0;
        const popupContent = buildPopupContent(feature.properties);
        layer.bindPopup(popupContent);

        layer.bindTooltip(`🏢 ${altura}m - ${feature.properties.tipo || 'Edificio'}`, {
          permanent: false,
          direction: 'center',
          className: 'edificio-tooltip',
        });
      }
    },
  }).addTo(mapInstance);

  return extraerCoordenadasDeFeatures(features);
};

export const addAPHLayer = (mapInstance: L.Map, features: GeoJSONFeature[]): number[][] => {
  const aphData: GeoJSONData = { type: 'FeatureCollection', features };

  L.geoJSON(aphData as unknown as geojson.GeoJsonObject, {
    style: (feature) => {
      const proteccion = feature?.properties?.PROTECCION || 'DESCONOCIDO';
      return crearAPHEffect(proteccion);
    },
    onEachFeature: (feature, layer) => {
      if (feature.properties) {
        const proteccion = (feature.properties.PROTECCION as string) || 'N/A';
        const estado = (feature.properties.ESTADO as string) || 'N/A';
        const catalogacion = (feature.properties.CATALOGACI as string) || '';

        const proteccionInfo = getProteccionInfo(proteccion);
        const popupContent = buildAPHPopupContent(
          feature,
          proteccionInfo,
          proteccion,
          estado,
          catalogacion
        );
        layer.bindPopup(popupContent);

        layer.bindTooltip(`${proteccionInfo.icono} APH: ${proteccion}`, {
          permanent: false,
          direction: 'center',
          className: 'aph-tooltip',
        });
      }
    },
  }).addTo(mapInstance);

  return extraerCoordenadasDeFeatures(features);
};

export const addSuperficieEdificableLayer = (
  mapInstance: L.Map,
  features: GeoJSONFeature[]
): number[][] => {
  const styles = getMapStyles();
  const seData: GeoJSONData = { type: 'FeatureCollection', features };

  L.geoJSON(seData as unknown as geojson.GeoJsonObject, {
    style: styles.superficieEdificable,
    onEachFeature: (feature, layer) => {
      if (feature.properties) {
        const propertiesHtml = Object.entries(feature.properties)
          .filter(([, value]) => value !== null && value !== undefined)
          .map(([key, value]) => `<strong>${key}:</strong> ${value}<br>`)
          .join('');
        const popupContent = `<div><strong>Superficie Edificable</strong><br>${propertiesHtml}</div>`;
        layer.bindPopup(popupContent);
      }
    },
  }).addTo(mapInstance);

  return extraerCoordenadasDeFeatures(features);
};

export const addLIBLayer = (mapInstance: L.Map, features: GeoJSONFeature[]): number[][] => {
  const styles = getMapStyles();
  const libData: GeoJSONData = { type: 'FeatureCollection', features };

  L.geoJSON(libData as unknown as geojson.GeoJsonObject, {
    style: styles.lib,
    onEachFeature: (feature, layer) => {
      if (feature.properties) {
        const propertiesHtml = Object.entries(feature.properties)
          .filter(([, value]) => value !== null && value !== undefined)
          .map(([key, value]) => `<strong>${key}:</strong> ${value}<br>`)
          .join('');
        const popupContent = `<div><strong>Línea Interna de Basamento (LIB)</strong><br>${propertiesHtml}</div>`;
        layer.bindPopup(popupContent);
      }
    },
  }).addTo(mapInstance);

  return extraerCoordenadasDeFeatures(features);
};

export const addLFILayer = (mapInstance: L.Map, features: GeoJSONFeature[]): number[][] => {
  const styles = getMapStyles();
  const lfiData: GeoJSONData = { type: 'FeatureCollection', features };

  L.geoJSON(lfiData as unknown as geojson.GeoJsonObject, {
    style: styles.lfi,
    onEachFeature: (feature, layer) => {
      if (feature.properties) {
        const propertiesHtml = Object.entries(feature.properties)
          .filter(([, value]) => value !== null && value !== undefined)
          .map(([key, value]) => `<strong>${key}:</strong> ${value}<br>`)
          .join('');
        const popupContent = `<div><strong>Línea de Frente Interno (LFI)</strong><br>${propertiesHtml}</div>`;
        layer.bindPopup(popupContent);
      }
    },
  }).addTo(mapInstance);

  return extraerCoordenadasDeFeatures(features);
};

export const addBandaMinimaLayer = (mapInstance: L.Map, features: GeoJSONFeature[]): number[][] => {
  const styles = getMapStyles();
  const bandaData: GeoJSONData = { type: 'FeatureCollection', features };

  L.geoJSON(bandaData as unknown as geojson.GeoJsonObject, {
    style: styles.bandaMinima,
    onEachFeature: (feature, layer) => {
      if (feature.properties) {
        const propertiesHtml = Object.entries(feature.properties)
          .filter(([, value]) => value !== null && value !== undefined)
          .map(([key, value]) => `<strong>${key}:</strong> ${value}<br>`)
          .join('');
        const popupContent = `<div><strong>🟣 Banda Mínima</strong><br>${propertiesHtml}</div>`;
        layer.bindPopup(popupContent);
      }
    },
  }).addTo(mapInstance);

  return extraerCoordenadasDeFeatures(features);
};

export const addTronerasLayer = (mapInstance: L.Map, features: TroneraFeature[]): number[][] => {
  const styles = getMapStyles();
  const tronerasData: GeoJSONData = { type: 'FeatureCollection', features };

  L.geoJSON(tronerasData as unknown as geojson.GeoJsonObject, {
    style: styles.troneras,
    onEachFeature: (feature, layer) => {
      if (feature.properties) {
        const tamaño = feature.properties.tamaño_metros || 'N/A';
        const popupContent = `<div><strong>🟢 TRONERA</strong><br>
          <strong>Posición:</strong> ${feature.properties.posicion || 'N/A'}<br>
          <strong>Tamaño:</strong> ${tamaño}m × ${tamaño}m<br>
          <strong>Área:</strong> ${feature.properties.area?.toFixed(2) || 'N/A'} m²<br>
          <strong>Tipo esquina:</strong> ${feature.properties.tipo_esquina || 'N/A'}<br>
          ${feature.properties.angulo ? `<strong>Ángulo:</strong> ${feature.properties.angulo.toFixed(1)}°<br>` : ''}
          ${feature.properties.distancia_anterior ? `<strong>Distancia anterior:</strong> ${feature.properties.distancia_anterior.toFixed(1)}m<br>` : ''}
          ${feature.properties.distancia_siguiente ? `<strong>Distancia siguiente:</strong> ${feature.properties.distancia_siguiente.toFixed(1)}m<br>` : ''}
          <strong>Método:</strong> ${feature.properties.metodo || 'N/A'}<br>
          <strong>Descripción:</strong> ${feature.properties.descripcion || 'N/A'}<br>
        </div>`;
        layer.bindPopup(popupContent);
      }
    },
  }).addTo(mapInstance);

  return extraerCoordenadasDeTroneras(features);
};
