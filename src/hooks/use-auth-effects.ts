import { useEffect, useRef } from 'react';

import { Usuario } from '../types/enums';

interface UseAuthEffectsProps {
  loadingRef: React.MutableRefObject<boolean>;
  setUsuario: (usuario: Usuario | null) => void;
  setLoading: (loading: boolean) => void;
  cargarUsuario: () => Promise<void>;
  isTokenExpired: (token: string) => boolean;
}

export const useAuthEffects = ({
  loadingRef,
  setUsuario,
  setLoading,
  cargarUsuario,
  isTokenExpired,
}: UseAuthEffectsProps) => {
  const cargarUsuarioRef = useRef(cargarUsuario);
  cargarUsuarioRef.current = cargarUsuario;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem('token');
      localStorage.removeItem('userProfile');
      setUsuario(null);
      setLoading(false);
      return;
    }

    if (loadingRef.current) return;
    loadingRef.current = true;
    void cargarUsuarioRef.current();
  }, [isTokenExpired, loadingRef, setUsuario, setLoading]);

  useEffect(() => {
    const migrateAddressHistory = async (userId: string) => {
      try {
        const { migrateAddressHistoryFromLocalStorage } = await import(
          '../utils/migrate-address-history'
        );
        await migrateAddressHistoryFromLocalStorage(userId);
      } catch (error) {
        console.error('Error en migración de historial:', error);
      }
    };

    const userProfile = localStorage.getItem('userProfile');
    if (userProfile) {
      try {
        const usuario = JSON.parse(userProfile) as Usuario;
        if (usuario?.id) {
          void migrateAddressHistory(usuario.id);
        }
      } catch {
        // Ignorar errores de parsing
      }
    }
  }, []);
};
