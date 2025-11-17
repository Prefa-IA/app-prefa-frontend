import { auth } from './api';

export interface AddressHistoryItem {
  address: string;
  timestamp: number;
}

let cachedHistory: AddressHistoryItem[] | null = null;
let loadingPromise: Promise<AddressHistoryItem[]> | null = null;

async function loadHistoryFromAPI(): Promise<AddressHistoryItem[]> {
  try {
    const data = await auth.getAddressHistory();
    cachedHistory = data;
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
    cachedHistory = null;
    loadingPromise = null;
  } catch (error) {
    console.error('Error agregando dirección al historial:', error);
  }
}

export async function listAddressHistory(): Promise<AddressHistoryItem[]> {
  // Si hay una carga en progreso, esperarla
  if (loadingPromise) {
    return loadingPromise;
  }

  // Si hay caché, retornarlo
  if (cachedHistory !== null) {
    return cachedHistory;
  }

  // Cargar desde la API
  loadingPromise = loadHistoryFromAPI();
  const result = await loadingPromise;
  loadingPromise = null;
  return result;
}
