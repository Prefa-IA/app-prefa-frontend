import L from 'leaflet';
import { GeoJSONFeature, TroneraFeature, GeoJSONData, GeoJSONDataState } from '../types/enums';
import { getMapStyles, crear3DEffect, crearAPHEffect } from './mapStyles';
import { extraerCoordenadasDeFeatures, extraerCoordenadasDeTroneras } from './geoCalculations';

export const clearMapLayers = (mapInstance: L.Map): void => {
  mapInstance.eachLayer((layer) => {
    if (layer instanceof L.TileLayer) return;
    if (layer instanceof L.Marker) return;
    mapInstance.removeLayer(layer);
  });
};

export const addManzanasLayer = (
  mapInstance: L.Map, 
  features: GeoJSONFeature[]
): number[][] => {
  const styles = getMapStyles();
  const manzanasData: GeoJSONData = { type: "FeatureCollection", features };
  
  L.geoJSON(manzanasData as any, {
    style: styles.mapaManzanas,
    onEachFeature: (feature, layer) => {
      if (feature.properties) {
        let popupContent = "<div><strong>🏘️ Manzana</strong><br>";
        popupContent += `<strong>ID:</strong> ${feature.properties.id || 'N/A'}<br>`;
        popupContent += `<strong>Sector-Manzana:</strong> ${feature.properties.sm || 'N/A'}<br>`;
        popupContent += `<strong>Tipo:</strong> ${feature.properties.tipo || 'N/A'}<br>`;
        popupContent += "</div>";
        layer.bindPopup(popupContent);
      }
    }
  }).addTo(mapInstance);

  return extraerCoordenadasDeFeatures(features);
};

export const addTejidoLayer = (
  mapInstance: L.Map, 
  features: GeoJSONFeature[]
): number[][] => {
  const tejidoData: GeoJSONData = { type: "FeatureCollection", features };
  
  L.geoJSON(tejidoData as any, {
    style: (feature) => {
      const altura = feature?.properties?.altura || 0;
      const tipo = feature?.properties?.tipo || 'edificio';
      return crear3DEffect(altura, tipo);
    },
    onEachFeature: (feature, layer) => {
      if (feature.properties) {
        const altura = feature.properties.altura || 0;
        const altos = feature.properties.altos || 0;
        const consolidacion = feature.properties.consolidad || 0;
        
        let popupContent = "<div><strong>🏢 Tejido Urbano 3D</strong><br>";
        popupContent += `<strong>SMP:</strong> ${feature.properties.smp || 'N/A'}<br>`;
        popupContent += `<strong>📏 Altura:</strong> <span style="color: ${altura > 20 ? '#DC2626' : altura > 10 ? '#F59E0B' : '#10B981'}">${altura}m</span><br>`;
        popupContent += `<strong>🏗️ Pisos:</strong> ${altos}<br>`;
        popupContent += `<strong>🏛️ Tipo:</strong> ${feature.properties.tipo || 'N/A'}<br>`;
        popupContent += `<strong>📊 Consolidación:</strong> <span style="color: ${consolidacion > 0.7 ? '#10B981' : consolidacion > 0.4 ? '#F59E0B' : '#DC2626'}">${consolidacion}</span><br>`;
        popupContent += `<strong>📍 Origen:</strong> ${feature.properties.origen || 'N/A'}<br>`;
        popupContent += `<strong>📋 Fuente:</strong> ${feature.properties.fuente || 'N/A'}<br>`;
        
        if (altura > 0) {
          const categoria = altura > 30 ? 'Torre' : altura > 15 ? 'Edificio alto' : altura > 8 ? 'Edificio medio' : 'Edificio bajo';
          popupContent += `<strong>🏗️ Categoría:</strong> <span style="color: #3B82F6">${categoria}</span><br>`;
        }
        
        popupContent += "</div>";
        layer.bindPopup(popupContent);
        
        layer.bindTooltip(`🏢 ${altura}m - ${feature.properties.tipo || 'Edificio'}`, {
          permanent: false,
          direction: 'center',
          className: 'edificio-tooltip'
        });
      }
    }
  }).addTo(mapInstance);

  return extraerCoordenadasDeFeatures(features);
};

export const addAPHLayer = (
  mapInstance: L.Map, 
  features: GeoJSONFeature[]
): number[][] => {
  const aphData: GeoJSONData = { type: "FeatureCollection", features };
  
  L.geoJSON(aphData as any, {
    style: (feature) => {
      const proteccion = feature?.properties?.PROTECCION || 'DESCONOCIDO';
      return crearAPHEffect(proteccion);
    },
    onEachFeature: (feature, layer) => {
      if (feature.properties) {
        const proteccion = feature.properties.PROTECCION || 'N/A';
        const estado = feature.properties.ESTADO || 'N/A';
        const catalogacion = feature.properties.CATALOGACI || '';
        
        let iconoProteccion = '🏛️';
        let colorProteccion = '#6B7280';
        
        switch (proteccion.toUpperCase()) {
          case 'INTEGRAL':
            iconoProteccion = '🏛️⭐';
            colorProteccion = '#DC2626';
            break;
          case 'ESTRUCTURAL':
            iconoProteccion = '🏛️🔒';
            colorProteccion = '#DC2626';
            break;
          case 'CAUTELAR':
            iconoProteccion = '🏛️⚠️';
            colorProteccion = '#F59E0B';
            break;
          case 'DESESTIMADO':
            iconoProteccion = '🏛️❌';
            colorProteccion = '#6B7280';
            break;
        }
        
        let popupContent = `<div><strong>${iconoProteccion} Área de Protección Histórica</strong><br>`;
        popupContent += `<strong>SMP:</strong> ${feature.properties.SMP || 'N/A'}<br>`;
        popupContent += `<strong>🏘️ Barrio:</strong> ${feature.properties.BARRIOS || 'N/A'}<br>`;
        popupContent += `<strong>🗺️ Comuna:</strong> ${feature.properties.COMUNA || 'N/A'}<br>`;
        if (feature.properties['1_DIRECCIO']) {
          popupContent += `<strong>📍 Dirección:</strong> ${feature.properties['1_DIRECCIO']}<br>`;
        }
        popupContent += `<strong>🛡️ Protección:</strong> <span style="color: ${colorProteccion}; font-weight: bold;">${proteccion}</span><br>`;
        popupContent += `<strong>📋 Estado:</strong> ${estado}<br>`;
        popupContent += `<strong>⚖️ Ley 3056:</strong> ${feature.properties.LEY_3056 || 'N/A'}<br>`;
        if (feature.properties.DENOMINACI) {
          popupContent += `<strong>🏛️ Denominación:</strong> ${feature.properties.DENOMINACI}<br>`;
        }
        if (catalogacion) {
          popupContent += `<strong>📚 Catalogación:</strong> ${catalogacion}<br>`;
        }
        
        let nivelInfo = '';
        switch (proteccion.toUpperCase()) {
          case 'INTEGRAL':
            nivelInfo = '<div style="background: #FEE2E2; padding: 8px; margin-top: 8px; border-radius: 4px; font-size: 12px;"><strong>⚠️ PROTECCIÓN MÁXIMA:</strong> Edificio con valor patrimonial excepcional. Restricciones muy estrictas.</div>';
            break;
          case 'ESTRUCTURAL':
            nivelInfo = '<div style="background: #FEF3C7; padding: 8px; margin-top: 8px; border-radius: 4px; font-size: 12px;"><strong>🔧 PROTECCIÓN ESTRUCTURAL:</strong> Se debe mantener la estructura y fachada principal.</div>';
            break;
          case 'CAUTELAR':
            nivelInfo = '<div style="background: #FEF3C7; padding: 8px; margin-top: 8px; border-radius: 4px; font-size: 12px;"><strong>⏳ PROTECCIÓN CAUTELAR:</strong> Medida preventiva mientras se estudia su valor patrimonial.</div>';
            break;
          case 'DESESTIMADO':
            nivelInfo = '<div style="background: #F3F4F6; padding: 8px; margin-top: 8px; border-radius: 4px; font-size: 12px;"><strong>❌ SIN PROTECCIÓN:</strong> No presenta valor patrimonial significativo.</div>';
            break;
        }
        
        popupContent += nivelInfo;
        popupContent += "</div>";
        layer.bindPopup(popupContent);
        
        layer.bindTooltip(`${iconoProteccion} APH: ${proteccion}`, {
          permanent: false,
          direction: 'center',
          className: 'aph-tooltip'
        });
      }
    }
  }).addTo(mapInstance);

  return extraerCoordenadasDeFeatures(features);
};

export const addSuperficieEdificableLayer = (
  mapInstance: L.Map, 
  features: GeoJSONFeature[]
): number[][] => {
  const styles = getMapStyles();
  const seData: GeoJSONData = { type: "FeatureCollection", features };
  
  L.geoJSON(seData as any, {
    style: styles.superficieEdificable,
    onEachFeature: (feature, layer) => {
      if (feature.properties) {
        let popupContent = "<div><strong>Superficie Edificable</strong><br>";
        for (const [key, value] of Object.entries(feature.properties)) {
          if (value !== null && value !== undefined) {
            popupContent += `<strong>${key}:</strong> ${value}<br>`;
          }
        }
        popupContent += "</div>";
        layer.bindPopup(popupContent);
      }
    }
  }).addTo(mapInstance);

  return extraerCoordenadasDeFeatures(features);
};

export const addLIBLayer = (
  mapInstance: L.Map, 
  features: GeoJSONFeature[]
): number[][] => {
  const styles = getMapStyles();
  const libData: GeoJSONData = { type: "FeatureCollection", features };
  
  L.geoJSON(libData as any, {
    style: styles.lib,
    onEachFeature: (feature, layer) => {
      if (feature.properties) {
        let popupContent = "<div><strong>Línea Interna de Basamento (LIB)</strong><br>";
        for (const [key, value] of Object.entries(feature.properties)) {
          if (value !== null && value !== undefined) {
            popupContent += `<strong>${key}:</strong> ${value}<br>`;
          }
        }
        popupContent += "</div>";
        layer.bindPopup(popupContent);
      }
    }
  }).addTo(mapInstance);

  return extraerCoordenadasDeFeatures(features);
};

export const addLFILayer = (
  mapInstance: L.Map, 
  features: GeoJSONFeature[]
): number[][] => {
  const styles = getMapStyles();
  const lfiData: GeoJSONData = { type: "FeatureCollection", features };
  
  L.geoJSON(lfiData as any, {
    style: styles.lfi,
    onEachFeature: (feature, layer) => {
      if (feature.properties) {
        let popupContent = "<div><strong>Línea de Frente Interno (LFI)</strong><br>";
        for (const [key, value] of Object.entries(feature.properties)) {
          if (value !== null && value !== undefined) {
            popupContent += `<strong>${key}:</strong> ${value}<br>`;
          }
        }
        popupContent += "</div>";
        layer.bindPopup(popupContent);
      }
    }
  }).addTo(mapInstance);

  return extraerCoordenadasDeFeatures(features);
};

export const addBandaMinimaLayer = (
  mapInstance: L.Map, 
  features: GeoJSONFeature[]
): number[][] => {
  const styles = getMapStyles();
  const bandaData: GeoJSONData = { type: "FeatureCollection", features };
  
  L.geoJSON(bandaData as any, {
    style: styles.bandaMinima,
    onEachFeature: (feature, layer) => {
      if (feature.properties) {
        let popupContent = "<div><strong>🟣 Banda Mínima</strong><br>";
        for (const [key, value] of Object.entries(feature.properties)) {
          if (value !== null && value !== undefined) {
            popupContent += `<strong>${key}:</strong> ${value}<br>`;
          }
        }
        popupContent += "</div>";
        layer.bindPopup(popupContent);
      }
    }
  }).addTo(mapInstance);

  return extraerCoordenadasDeFeatures(features);
};

export const addTronerasLayer = (
  mapInstance: L.Map, 
  features: TroneraFeature[]
): number[][] => {
  const styles = getMapStyles();
  const tronerasData: GeoJSONData = { type: "FeatureCollection", features };
  
  L.geoJSON(tronerasData as any, {
    style: styles.troneras,
    onEachFeature: (feature, layer) => {
      if (feature.properties) {
        let popupContent = "<div><strong>🟢 TRONERA</strong><br>";
        popupContent += `<strong>Posición:</strong> ${feature.properties.posicion || 'N/A'}<br>`;
        popupContent += `<strong>Tamaño:</strong> ${feature.properties.tamaño_metros || 'N/A'}m × ${feature.properties.tamaño_metros || 'N/A'}m<br>`;
        popupContent += `<strong>Área:</strong> ${feature.properties.area?.toFixed(2) || 'N/A'} m²<br>`;
        popupContent += `<strong>Tipo esquina:</strong> ${feature.properties.tipo_esquina || 'N/A'}<br>`;
        if (feature.properties.angulo) {
          popupContent += `<strong>Ángulo:</strong> ${feature.properties.angulo.toFixed(1)}°<br>`;
        }
        if (feature.properties.distancia_anterior) {
          popupContent += `<strong>Distancia anterior:</strong> ${feature.properties.distancia_anterior.toFixed(1)}m<br>`;
        }
        if (feature.properties.distancia_siguiente) {
          popupContent += `<strong>Distancia siguiente:</strong> ${feature.properties.distancia_siguiente.toFixed(1)}m<br>`;
        }
        popupContent += `<strong>Método:</strong> ${feature.properties.metodo || 'N/A'}<br>`;
        popupContent += `<strong>Descripción:</strong> ${feature.properties.descripcion || 'N/A'}<br>`;
        popupContent += "</div>";
        layer.bindPopup(popupContent);
      }
    }
  }).addTo(mapInstance);

  return extraerCoordenadasDeTroneras(features);
}; 