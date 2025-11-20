import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import maplibregl from 'maplibre-gl';

import { useMapData } from '../../hooks/use-map-data';
import { useMapInitialization } from '../../hooks/use-map-initialization';
import { useMapLayers } from '../../hooks/use-map-layers';
import { MapData, ViewerProps } from '../../types/components';

import StatsOverlay from './StatsOverlay';

import 'maplibre-gl/dist/maplibre-gl.css';

const LbiLfiViewerMapLibre: React.FC<ViewerProps> = ({
  smp,
  centro,
  geometriaParcela,
  showStatsOverlay = true,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const mapDataRef = useRef<MapData | null>(null);
  const isMapLoadedRef = useRef<boolean>(false);
  const isMountedRef = useRef<boolean>(true);

  const { drawLayers } = useMapLayers({ mapRef, mapDataRef, centro, geometriaParcela });

  const handleMapLoad = useCallback(() => {
    drawLayers();
  }, [drawLayers]);

  useMapInitialization({
    mapContainer,
    mapRef,
    isMapLoadedRef,
    isMountedRef,
    centro: { lat: centro.lat, lng: centro.lon },
    onMapLoad: handleMapLoad,
  });

  useEffect(() => {
    if (isMapLoadedRef.current) {
      drawLayers();
    }
  }, [geometriaParcela, drawLayers]);

  const geometriaGeoJSON: GeoJSON.Geometry | null = useMemo(
    () =>
      geometriaParcela
        ? ({
            type: geometriaParcela.type,
            ...(geometriaParcela.features && geometriaParcela.features.length > 0
              ? { geometries: geometriaParcela.features.map((f) => f.geometry) }
              : {}),
          } as GeoJSON.Geometry)
        : null,
    [geometriaParcela]
  );

  const handleDataLoaded = useCallback(() => {
    if (isMapLoadedRef.current) {
      drawLayers();
    }
  }, [drawLayers]);

  const { estadisticas } = useMapData({
    smp,
    geometriaParcela: geometriaGeoJSON,
    mapDataRef,
    onDataLoaded: handleDataLoaded,
  });

  useEffect(() => {
    if (isMapLoadedRef.current && estadisticas) {
      const timer = setTimeout(() => {
        drawLayers();
      }, 100);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [estadisticas, drawLayers]);

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      <div
        ref={mapContainer}
        style={{
          width: '100%',
          height: '600px',
          borderRadius: '4px',
          border: '1px solid #ddd',
        }}
      />
      {showStatsOverlay && estadisticas && <StatsOverlay estadisticas={estadisticas} />}
    </div>
  );
};

export default LbiLfiViewerMapLibre;
