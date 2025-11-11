import { auth } from '../services/api';

const OLD_KEY = 'addressHistory';

/**
 * Migra el historial de direcciones del localStorage a la base de datos
 * Solo se ejecuta una vez si detecta datos en localStorage
 */
export async function migrateAddressHistoryFromLocalStorage(userId: string): Promise<void> {
  try {
    // Verificar si ya hay datos en la base de datos
    const dbHistory = await auth.getAddressHistory();
    if (dbHistory && dbHistory.length > 0) {
      // Ya hay datos en la DB, no migrar
      return;
    }

    // Intentar leer del localStorage
    const raw = localStorage.getItem(OLD_KEY);
    if (!raw) {
      // No hay datos en localStorage
      return;
    }

    const localHistory = JSON.parse(raw);
    if (!Array.isArray(localHistory) || localHistory.length === 0) {
      // Datos inválidos o vacíos
      return;
    }

    // Migrar cada dirección a la base de datos
    for (const item of localHistory.slice(0, 100)) {
      if (item.address && typeof item.address === 'string') {
        try {
          await auth.addAddressToHistory(item.address);
        } catch (error) {
          console.error('Error migrando dirección:', item.address, error);
        }
      }
    }

    // Opcional: eliminar del localStorage después de migrar exitosamente
    // localStorage.removeItem(OLD_KEY);
  } catch (error) {
    console.error('Error en migración de historial:', error);
  }
}

