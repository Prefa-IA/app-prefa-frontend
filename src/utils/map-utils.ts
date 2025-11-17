import axios from 'axios';

import { CONSULTA_DIRECCION_CONFIG } from '../types/enums';

export interface Coordinates {
  lat: number;
  lng: number;
}

export const getCoordinatesFromAddress = async (
  address: string,
  googleMapsKey: string
): Promise<Coordinates | null> => {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address + ', Ciudad Autónoma de Buenos Aires, Argentina')}&key=${googleMapsKey}`;
    const response = await axios.get(url);

    if (response.data.results && response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;
      return {
        lat: location.lat,
        lng: location.lng,
      };
    }
    return null;
  } catch (error) {
    console.error('Error al obtener coordenadas:', error);
    return null;
  }
};

export const getDefaultMapCenter = (): Coordinates => {
  return CONSULTA_DIRECCION_CONFIG.MAP.DEFAULT_CENTER;
};

export const updateMapCenter = (
  informe: { googleMaps?: { lat?: string; lon?: string } },
  setCenter: (center: Coordinates) => void
): void => {
  if (informe?.googleMaps?.lat && informe?.googleMaps?.lon) {
    setCenter({
      lat: parseFloat(informe.googleMaps.lat),
      lng: parseFloat(informe.googleMaps.lon),
    });
  }
};
