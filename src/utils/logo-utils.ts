const TEMP_LOGO_KEY = 'tempLogo';

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

export const getTempLogo = (): string | null => {
  return localStorage.getItem(TEMP_LOGO_KEY);
};

export const clearTempLogo = (): void => {
  localStorage.removeItem(TEMP_LOGO_KEY);
};
