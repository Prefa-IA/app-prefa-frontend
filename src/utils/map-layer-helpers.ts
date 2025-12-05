import maplibregl, { LayerSpecification, Map } from 'maplibre-gl';

export const addOrUpdateLayer = (
  map: Map,
  id: string,
  geoJsonData: GeoJSON.FeatureCollection,
  layerConfig: {
    type: 'line' | 'fill';
    paint: Record<string, string | number | boolean | null | undefined>;
  }
): void => {
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
      paint: layerConfig.paint,
    } as LayerSpecification);
  }
};

type Coordinate = [number, number] | Coordinate[];

export const extendBounds = (
  bounds: maplibregl.LngLatBounds,
  coords: Coordinate | null | undefined
): void => {
  if (!coords) return;
  if (Array.isArray(coords) && coords.length > 0) {
    if (typeof coords[0] === 'number') {
      bounds.extend(coords as [number, number]);
    } else {
      coords.forEach((coord) => {
        extendBounds(bounds, coord as Coordinate);
      });
    }
  }
};
