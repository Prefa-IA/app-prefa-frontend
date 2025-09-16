export const ENV_CONFIG = {
  GOOGLE_MAPS_API_KEY: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'AIzaSyB8PJ9MnZL1Di8qU7zkuiqMqr_rc4C8PpM',
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:4000'
} as const;

export const getGoogleMapsKey = (): string => {
  return ENV_CONFIG.GOOGLE_MAPS_API_KEY;
};

export const getApiUrl = (): string => {
  return ENV_CONFIG.API_URL;
};

export const API_CONFIG = {
  // Configuración de la API principal
  baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:4000',
  timeout: 30000,
  
  // Endpoints principales
  endpoints: {
    auth: '/api/auth',
    prefactibilidad: '/api/prefactibilidad',
    suscripciones: '/api/suscripciones'
  }
};

export const USIG_CONFIG = {
  // URLs de servicios USIG
  baseUrl: 'https://servicios.usig.buenosaires.gob.ar',
  mapUrl: 'https://servicios.usig.buenosaires.gob.ar/usig-js/3.2/usig.MapaInteractivo.min.js',
  
  // Configuración de mapas
  defaultCenter: { lat: -34.6037, lng: -58.3816 },
  defaultZoom: 15
};

export const CESIUM_CONFIG = {
  // Token de Cesium para visualización 3D
  token: process.env.REACT_APP_CESIUM_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5NjUxYmMzYi1jYTlmLTRhYTItYjRhOC0yYmZkYTliMGU0YWYiLCJpZCI6MzE1Njk4LCJpYXQiOjE3NTA4Nzc2ODR9.gkotZ3o8HMq3qDTZb5CTT7MwYS0R43r8XYj3TECQkYg',
  
  // URLs de Cesium
  jsUrl: 'https://cesium.com/downloads/cesiumjs/releases/1.95/Build/Cesium/Cesium.js',
  cssUrl: 'https://cesium.com/downloads/cesiumjs/releases/1.95/Build/Cesium/Widgets/widgets.css'
}; 