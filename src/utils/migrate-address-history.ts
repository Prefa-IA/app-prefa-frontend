const OLD_KEY = 'addressHistory';

/**
 * Migra el historial de direcciones del localStorage a la base de datos
 * Solo se ejecuta una vez si detecta datos en localStorage
 * IMPORTANTE: Esta función está deshabilitada porque el localStorage es compartido
 * entre usuarios en el mismo navegador, lo que causaba que direcciones de un usuario
 * se migraran a otros usuarios nuevos.
 */
export async function migrateAddressHistoryFromLocalStorage(_userId: string): Promise<void> {
  try {
    localStorage.removeItem(OLD_KEY);
  } catch (error) {
    console.error('Error limpiando localStorage:', error);
  }

  return;
}
