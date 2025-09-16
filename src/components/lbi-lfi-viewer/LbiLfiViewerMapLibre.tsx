import React, { useEffect, useRef, useState } from 'react';
import maplibregl, { Map, LayerSpecification } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MapData {
  lfi: GeoJSON.FeatureCollection;
  lib: GeoJSON.FeatureCollection;
  parcela?: GeoJSON.FeatureCollection;
  afectaciones?: {
    parcela_afectada_lfi: GeoJSON.Feature | null;
    parcela_afectada_lib: GeoJSON.Feature | null;
    porcentaje_afectacion_lfi: number;
    porcentaje_afectacion_lib: number;
    area_total_parcela: number;
    area_afectada_lfi: number;
    area_afectada_lib: number;
  };
  estadisticas?: {
    total_esquinas: number;
    esquinas_con_troneras: number;
    porcentaje_afectacion_lfi: number;
    porcentaje_afectacion_lib: number;
  };
}

interface ViewerProps {
  smp: string;
  centro: { lat: number; lon: number };
  geometriaParcela?: any;
  showStatsOverlay?: boolean;
}

const LbiLfiViewerMapLibre: React.FC<ViewerProps> = ({ smp, centro, geometriaParcela, showStatsOverlay = true }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const mapDataRef = useRef<MapData | null>(null);
  const isMapLoadedRef = useRef<boolean>(false);
  const [estadisticas, setEstadisticas] = useState<MapData['estadisticas'] | null>(null);

  const drawLayers = () => {
    const map = mapRef.current;
    const data = mapDataRef.current;

    if (!map || !data || !map.isStyleLoaded()) {
        console.warn("Se intentó dibujar, pero las condiciones no estaban listas.");
        return;
    }
    
    const addOrUpdateLayer = (
      id: string, 
      geoJsonData: GeoJSON.FeatureCollection, 
      layerConfig: {
        type: 'line' | 'fill';
        paint: Record<string, any>;
      }
    ) => {
      const sourceId = `${id}-source`;
      const layerId = `${id}-layer`;
      
      const source = map.getSource(sourceId) as maplibregl.GeoJSONSource;
      if (source) {
        source.setData(geoJsonData);
      } else {
        map.addSource(sourceId, { type: 'geojson', data: geoJsonData });
        map.addLayer({ 
          id: layerId, 
          type: layerConfig.type, 
          source: sourceId, 
          paint: layerConfig.paint 
        } as LayerSpecification);
      }
    };

    // Dibujar parcela completa (contorno)
    if (data.parcela && data.parcela.features.length > 0) {
      data.parcela.features.forEach((feat, idx) => {
        const featCollection = { type: 'FeatureCollection', features: [feat] } as GeoJSON.FeatureCollection;
        addOrUpdateLayer(`parcela-${idx}`, featCollection, {
          type: 'fill',
          paint: { 
            'fill-color': '#FFD700', 
            'fill-opacity': 0.4,
          }
        });
      });
    }

    // Dibujar área afectada por LFI (relleno amarillo)
    if (data.afectaciones?.parcela_afectada_lfi) {
      const parcelaAfectadaLfi = {
        type: "FeatureCollection" as const,
        features: [data.afectaciones.parcela_afectada_lfi]
      };
      
      addOrUpdateLayer('parcela-afectada-lfi', parcelaAfectadaLfi, {
        type: 'fill',
        paint: { 
          'fill-color': '#FFD700', 
          'fill-opacity': 1
        }
      });
    }

    // Dibujar área afectada por LIB (relleno amarillo más claro)
    if (data.afectaciones?.parcela_afectada_lib) {
      const parcelaAfectadaLib = {
        type: "FeatureCollection" as const,
        features: [data.afectaciones.parcela_afectada_lib]
      };
      
      addOrUpdateLayer('parcela-afectada-lib', parcelaAfectadaLib, {
        type: 'fill',
        paint: { 
          'fill-color': '#FFD700', 
          'fill-opacity': 0.3
        }
      });
    }

    // Dibujar LIB (línea naranja)
    if (data.lib?.features.length > 0) {
      addOrUpdateLayer('lib', data.lib, {
        type: 'line',
        paint: { 
          'line-color': '#FF6600', 
          'line-width': 3 
        }
      });
    }

    // Dibujar LFI con troneras (línea azul)
    if (data.lfi?.features.length > 0) {
      addOrUpdateLayer('lfi', data.lfi, {
        type: 'line',
        paint: { 
          'line-color': '#0066CC', 
          'line-width': 3 
        }
      });
    }

    // Centrar la vista de forma que se aprecie el contorno completo de la manzana/áreas LFI-LIB.
    const bounds = new maplibregl.LngLatBounds();

    const extendBounds = (coords: any) => {
      if (!coords) return;
      if (typeof coords[0] === 'number') {
        // Punto [lng, lat]
        bounds.extend(coords as [number, number]);
      } else {
        // Array anidado
        (coords as any[]).forEach(extendBounds);
      }
    };

    // Extender límites con todas las capas relevantes
    if (data.lib) {
      data.lib.features.forEach(f => extendBounds((f.geometry as any).coordinates));
    }
    if (data.lfi) {
      data.lfi.features.forEach(f => extendBounds((f.geometry as any).coordinates));
    }
    if (data.parcela) {
      data.parcela.features.forEach(f => extendBounds((f.geometry as any).coordinates));
    }

    if (!bounds.isEmpty()) {
      map.fitBounds(bounds, { padding: 50, maxZoom: 18, duration: 0 });
    } else {
      map.flyTo({ center: [centro.lon, centro.lat], zoom: 18, duration: 0 });
    }
  };

  // Efecto para cargar los datos
  useEffect(() => {
    if (!smp) return;
    
    const fetchData = async () => {
      try {
        let response;
        const base = (process.env.REACT_APP_API_URL || 'http://localhost:4000').replace(/\/$/, '');
        
        // Si tienes los datos completos de la parcela, úsalos
        const token = localStorage.getItem('token');
        const authHeaderValue = token ? `Bearer ${token}` : null;

        if (geometriaParcela) {
          const headers: Record<string, string> = { 'Content-Type': 'application/json' };
          if (authHeaderValue) headers.Authorization = authHeaderValue;
          response = await fetch(`${base}/mapdata/process-data`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              smp: smp,
              geometriaParcela: geometriaParcela
            })
          });
        } else {
          // Usar el endpoint original que hace fetch a la API
          const headers: Record<string, string> = {};
          if (authHeaderValue) headers.Authorization = authHeaderValue;
          const init: RequestInit = Object.keys(headers).length ? { headers } : {};
          response = await fetch(`${base}/mapdata/smp/${encodeURIComponent(smp)}`, init);
        }
        
        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        const data = await response.json();
        
        mapDataRef.current = data;
        setEstadisticas(data.estadisticas || null);

        if (isMapLoadedRef.current) {
            drawLayers();
        }
      } catch (err) {
        console.error("Error fetching map data:", err);
      }
    };
    
    fetchData();
  }, [smp, geometriaParcela]);

  // Efecto para inicializar el mapa
  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return;

    const pickStyleUrl = async (): Promise<string> => {
      const demotiles = 'https://demotiles.maplibre.org/style.json';
      const key = process.env.REACT_APP_MAPTILER_KEY || 'BvZtXULr9szx4d76ddiF';
      const styleEnv = process.env.REACT_APP_MAP_STYLE_URL;
      const primary = styleEnv || `https://api.maptiler.com/maps/dataviz/style.json?key=${key}`;
      try {
        const res = await fetch(primary, { method: 'HEAD' });
        if (res.ok) return primary;
      } catch (_e) {}
      return demotiles;
    };

    let isMounted = true;
    (async () => {
      const styleUrl = await pickStyleUrl();
      if (!isMounted) return;
      const map = new maplibregl.Map({
        container: mapContainer.current as HTMLDivElement,
        style: styleUrl,
        center: [centro.lon, centro.lat],
        zoom: 17,
      });
      
      mapRef.current = map;

      map.on('load', () => {
        isMapLoadedRef.current = true;

        if (mapDataRef.current) {
          drawLayers();
        }
      });
    })();

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      isMapLoadedRef.current = false;
    };
  }, [centro]);

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      <div 
        ref={mapContainer} 
        style={{ 
          width: '100%', 
          height: '600px', 
          borderRadius: '4px', 
          border: '1px solid #ddd' 
        }} 
      />
      
      {/* Panel de estadísticas */}
      {showStatsOverlay && estadisticas && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '15px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          minWidth: '250px',
          fontSize: '14px'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>
            Análisis de Afectación
          </h4>
          
          <div style={{ marginBottom: '8px' }}>
            <strong>Esquinas:</strong> {estadisticas.esquinas_con_troneras} de {estadisticas.total_esquinas} con troneras
          </div>
          
          <div style={{ marginBottom: '8px' }}>
            <strong>Afectación LFI:</strong> {estadisticas.porcentaje_afectacion_lfi}%
          </div>
          
          <div style={{ marginBottom: '8px' }}>
            <strong>Afectación LIB:</strong> {estadisticas.porcentaje_afectacion_lib}%
          </div>
          
          <div style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
            <div>🟡 Parcela afectada</div>
            <div>🔵 LFI con troneras</div>
            <div>🟠 LIB</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LbiLfiViewerMapLibre;