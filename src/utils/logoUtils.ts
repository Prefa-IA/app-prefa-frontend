/**
 * Utilidades para manejar el logo temporal en localStorage
 */

const TEMP_LOGO_KEY = 'tempLogo';

/**
 * Convierte un archivo a base64 y lo guarda temporalmente
 */
export const saveTempLogo = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      const base64String = reader.result as string;
      localStorage.setItem(TEMP_LOGO_KEY, base64String);
      resolve(base64String);
    };
    
    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Obtiene el logo temporal del localStorage
 */
export const getTempLogo = (): string | null => {
  return localStorage.getItem(TEMP_LOGO_KEY);
};

/**
 * Limpia el logo temporal del localStorage
 */
export const clearTempLogo = (): void => {
  localStorage.removeItem(TEMP_LOGO_KEY);
}; 