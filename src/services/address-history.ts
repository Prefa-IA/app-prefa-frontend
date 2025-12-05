import { auth } from './api';

export interface AddressHistoryItem {
  address: string;
  timestamp: number;
}

const cache = {
  history: null as AddressHistoryItem[] | null,
  loadingPromise: null as Promise<AddressHistoryItem[]> | null,
};

async function loadHistoryFromAPI(): Promise<AddressHistoryItem[]> {
  try {
    const data = await auth.getAddressHistory();
    cache.history = data;
    return data;
  } catch (error) {
    console.error('Error cargando historial de direcciones:', error);
    return [];
  }
}

export async function addAddressToHistory(address: string): Promise<void> {
  try {
    await auth.addAddressToHistory(address);
    // Actualizar caché
    cache.history = null;
    cache.loadingPromise = null;
  } catch (error) {
    console.error('Error agregando dirección al historial:', error);
  }
}

export async function listAddressHistory(forceRefresh = false): Promise<AddressHistoryItem[]> {
  // Si se fuerza la recarga, limpiar caché y promesa
  if (forceRefresh) {
    cache.history = null;
    cache.loadingPromise = null;
  }

  // Si hay una carga en progreso, esperarla
  if (cache.loadingPromise) {
    return cache.loadingPromise;
  }

  // Si hay caché, retornarlo
  if (cache.history !== null) {
    return cache.history;
  }

  // Cargar desde la API
  cache.loadingPromise = loadHistoryFromAPI();
  const result = await cache.loadingPromise;
  cache.loadingPromise = null;
  return result;
}
