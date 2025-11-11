export interface LogoValidationResult {
  isValid: boolean;
  error?: string;
  dimensions?: { width: number; height: number };
}

export const validateLogo = (file: File): Promise<LogoValidationResult> => {
  return new Promise((resolve) => {
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      resolve({ isValid: false, error: 'El archivo debe ser menor a 2MB' });
      return;
    }

    if (!file.type.startsWith('image/')) {
      resolve({ isValid: false, error: 'El archivo debe ser una imagen' });
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      
      if (img.width > 500 || img.height > 500) {
        resolve({ 
          isValid: false, 
          error: 'Las dimensiones máximas son 500px x 500px',
          dimensions: { width: img.width, height: img.height }
        });
      } else {
        resolve({ 
          isValid: true,
          dimensions: { width: img.width, height: img.height }
        });
      }
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ isValid: false, error: 'No se pudo procesar la imagen' });
    };
    
    img.src = url;
  });
};

