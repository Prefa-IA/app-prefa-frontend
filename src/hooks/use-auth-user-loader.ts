import { useCallback } from 'react';

import { auth as authService } from '../services/api';
import { Usuario } from '../types/enums';

interface UseAuthUserLoaderProps {
  loadingRef: React.MutableRefObject<boolean>;
  setUsuario: (usuario: Usuario | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthUserLoader = ({
  loadingRef,
  setUsuario,
  setLoading,
}: UseAuthUserLoaderProps) => {
  const cargarUsuario = useCallback(async () => {
    try {
      const usuario = await authService.obtenerPerfil();
      setUsuario(usuario);
      localStorage.setItem('userProfile', JSON.stringify(usuario));
    } catch (error) {
      console.error('Error al cargar usuario:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('userProfile');
      setUsuario(null);
    } finally {
      setLoading(false);
      if (loadingRef.current) {
        loadingRef.current = false;
      }
    }
  }, [setUsuario, setLoading, loadingRef]);

  return { cargarUsuario };
};
