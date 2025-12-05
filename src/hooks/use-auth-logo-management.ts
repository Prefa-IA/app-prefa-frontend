import { useCallback } from 'react';

import { Usuario } from '../types/enums';

interface UseAuthLogoManagementProps {
  usuario: Usuario | null;
  updatePersonalization: (personalizacion: Usuario['personalizacion']) => Promise<void>;
}

export const useAuthLogoManagement = ({
  usuario,
  updatePersonalization,
}: UseAuthLogoManagementProps) => {
  const saveTempLogo = useCallback(
    async (logoFile: File): Promise<string> => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const base64 = e.target?.result as string;

          if (usuario) {
            try {
              const nuevaPersonalizacion = {
                ...usuario.personalizacion,
                logo: base64,
              };
              await updatePersonalization(nuevaPersonalizacion);
            } catch (error) {
              console.error('Error al guardar logo en personalización:', error);
            }
          }

          resolve(base64);
        };
        reader.readAsDataURL(logoFile);
      });
    },
    [usuario, updatePersonalization]
  );

  const getTempLogo = useCallback((): string | null => {
    return usuario?.personalizacion?.logo || null;
  }, [usuario]);

  const clearTempLogo = useCallback(async (): Promise<void> => {
    if (usuario) {
      try {
        const nuevaPersonalizacion = {
          ...usuario.personalizacion,
          logo: '',
        };
        await updatePersonalization(nuevaPersonalizacion);
      } catch (error) {
        console.error('Error al eliminar logo de personalización:', error);
      }
    }
  }, [usuario, updatePersonalization]);

  return { saveTempLogo, getTempLogo, clearTempLogo };
};
