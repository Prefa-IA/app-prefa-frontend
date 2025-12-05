import { useCallback } from 'react';
import { toast } from 'react-toastify';

import { auth as authService } from '../services/api';
import { LoginCredentials, RegistroData, Usuario } from '../types/enums';

interface UseAuthAuthOperationsProps {
  setUsuario: (usuario: Usuario | null) => void;
}

export const useAuthAuthOperations = ({ setUsuario }: UseAuthAuthOperationsProps) => {
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        const { token, usuario } = await authService.login(credentials);
        localStorage.setItem('token', token);
        localStorage.setItem('userProfile', JSON.stringify(usuario));
        setUsuario(usuario);
        toast.success('¡Bienvenido de nuevo!');
      } catch (error: unknown) {
        const errorObj = error as { response?: { data?: { error?: string } } };
        const mensaje = errorObj?.response?.data?.error || 'Error al iniciar sesión';
        toast.error(mensaje);
        throw error;
      }
    },
    [setUsuario]
  );

  const registro = useCallback(async (datos: RegistroData) => {
    try {
      const { message } = await authService.registro(datos);
      toast.success(message || 'Registro exitoso. Revisa tu correo para verificar la cuenta.');
    } catch (error: unknown) {
      const errorObj = error as { response?: { data?: { error?: string } } };
      const mensaje = errorObj?.response?.data?.error || 'Error al registrar usuario';
      toast.error(mensaje);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userProfile');
    setUsuario(null);
    toast.info('Has cerrado sesión');
  }, [setUsuario]);

  return { login, registro, logout };
};
