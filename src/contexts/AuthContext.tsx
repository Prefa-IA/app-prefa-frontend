import React, { createContext, useContext, useRef, useState } from 'react';

import { useAuthAuthOperations } from '../hooks/use-auth-auth-operations';
import { useAuthEffects } from '../hooks/use-auth-effects';
import { useAuthLogoManagement } from '../hooks/use-auth-logo-management';
import { useAuthOperations } from '../hooks/use-auth-operations';
import { useAuthUserLoader } from '../hooks/use-auth-user-loader';
import { LoginCredentials, RegistroData, Usuario } from '../types/enums';
import { isTokenExpired } from '../utils/auth-token-utils';

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
  const loadingRef = useRef(false);

  const { cargarUsuario } = useAuthUserLoader({ loadingRef, setUsuario, setLoading });
  useAuthEffects({ loadingRef, setUsuario, setLoading, cargarUsuario, isTokenExpired });

  const { refreshProfile, updateProfile, updatePersonalization } = useAuthOperations({
    usuario,
    setUsuario,
    cargarUsuario,
  });

  const { login, registro, logout } = useAuthAuthOperations({ setUsuario });

  const { saveTempLogo, getTempLogo, clearTempLogo } = useAuthLogoManagement({
    usuario,
    updatePersonalization,
  });

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
