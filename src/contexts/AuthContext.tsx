import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { auth as authService } from '../services/api';
import { LoginCredentials, RegistroData, Usuario } from '../types/enums';

interface AuthContextType {
  usuario: Usuario | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  registro: (datos: RegistroData) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  updateProfile: (updatedData: Partial<Usuario>) => Promise<void>;
  updatePersonalization: (personalizacion: Usuario['personalizacion']) => Promise<void>;
  saveTempLogo: (logoFile: File) => Promise<string>;
  getTempLogo: () => string | null;
  clearTempLogo: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const loadingRef = React.useRef(false);

  const isTokenExpired = (token: string): boolean => {
    try {
      const parts = token.split('.');
      if (parts.length < 2) return true;
      const payloadPart = parts[1];
      if (!payloadPart) return true;
      const payload = JSON.parse(atob(payloadPart.replace(/-/g, '+').replace(/_/g, '/')));
      const exp = typeof payload.exp === 'number' ? payload.exp : 0;
      return !exp || Date.now() >= exp * 1000;
    } catch {
      return true;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || isTokenExpired(token)) {
      // Token ausente o vencido → limpiar y quedar deslogueado
      localStorage.removeItem('token');
      localStorage.removeItem('userProfile');
      setUsuario(null);
      setLoading(false);
      return;
    }

    if (loadingRef.current) return;
    loadingRef.current = true;
    void cargarUsuario();
  }, []);

  useEffect(() => {
    // Migrar historial de direcciones del localStorage a la DB si es necesario
    if (usuario?.id) {
      const migrateAddressHistory = async () => {
        try {
          const { migrateAddressHistoryFromLocalStorage } = await import(
            '../utils/migrate-address-history'
          );
          await migrateAddressHistoryFromLocalStorage(usuario.id);
        } catch (error) {
          console.error('Error en migración de historial:', error);
        }
      };
      void migrateAddressHistory();
    }
  }, [usuario?.id]);

  const cargarUsuario = async () => {
    try {
      const usuario = await authService.obtenerPerfil();
      setUsuario(usuario);
      localStorage.setItem('userProfile', JSON.stringify(usuario));
    } catch (error) {
      console.error('Error al cargar usuario:', error);
      // Ante 401 u otro error, limpiar sesión para evitar estado "logueado" inválido
      localStorage.removeItem('token');
      localStorage.removeItem('userProfile');
      setUsuario(null);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  const refreshProfile = async () => {
    await cargarUsuario();
  };

  const updateProfile = async (updatedData: Partial<Usuario>) => {
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
  };

  const updatePersonalization = async (personalizacion: Usuario['personalizacion']) => {
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
  };

  const login = async (credentials: LoginCredentials) => {
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
  };

  const registro = async (datos: RegistroData) => {
    try {
      const { message } = await authService.registro(datos);
      toast.success(message || 'Registro exitoso. Revisa tu correo para verificar la cuenta.');
    } catch (error: unknown) {
      const errorObj = error as { response?: { data?: { error?: string } } };
      const mensaje = errorObj?.response?.data?.error || 'Error al registrar usuario';
      toast.error(mensaje);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userProfile');
    setUsuario(null);
    toast.info('Has cerrado sesión');
  };

  const saveTempLogo = async (logoFile: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;

        // Guardar en personalización del usuario
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
  };

  const getTempLogo = (): string | null => {
    return usuario?.personalizacion?.logo || null;
  };

  const clearTempLogo = async (): Promise<void> => {
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
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        loading,
        login,
        registro,
        logout,
        updateProfile,
        updatePersonalization,
        saveTempLogo,
        getTempLogo,
        clearTempLogo,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
