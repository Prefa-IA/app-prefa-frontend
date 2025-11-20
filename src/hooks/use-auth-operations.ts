import { useCallback } from 'react';
import { toast } from 'react-toastify';

import { auth as authService } from '../services/api';
import { Usuario } from '../types/enums';

interface UseAuthOperationsProps {
  usuario: Usuario | null;
  setUsuario: (usuario: Usuario | null) => void;
  cargarUsuario: () => Promise<void>;
}

export const useAuthOperations = ({
  usuario,
  setUsuario,
  cargarUsuario,
}: UseAuthOperationsProps) => {
  const refreshProfile = useCallback(async () => {
    await cargarUsuario();
  }, [cargarUsuario]);

  const updateProfile = useCallback(
    async (updatedData: Partial<Usuario>) => {
      try {
        const updatedUser = await authService.updateProfile(updatedData);
        setUsuario(updatedUser);
        localStorage.setItem('userProfile', JSON.stringify(updatedUser));
        toast.success('Perfil actualizado correctamente');
      } catch (error: unknown) {
        const errorObj = error as { response?: { data?: { error?: string } } };
        const mensaje = errorObj?.response?.data?.error || 'Error al actualizar perfil';
        toast.error(mensaje);
        throw error;
      }
    },
    [setUsuario]
  );

  const updatePersonalization = useCallback(
    async (personalizacion: Usuario['personalizacion']) => {
      if (!usuario) return;

      try {
        const result = await authService.updatePersonalization(personalizacion);
        setUsuario(result);
        localStorage.setItem('userProfile', JSON.stringify(result));
        toast.success('Personalización guardada');
      } catch (error: unknown) {
        const errorObj = error as { response?: { data?: { error?: string } } };
        const mensaje = errorObj?.response?.data?.error || 'Error al guardar personalización';
        toast.error(mensaje);
        throw error;
      }
    },
    [usuario, setUsuario]
  );

  return { refreshProfile, updateProfile, updatePersonalization };
};
