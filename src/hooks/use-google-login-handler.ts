import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useAuth } from '../contexts/AuthContext';
import { auth as authService } from '../services/api';

interface GoogleCredentialResponse {
  credential: string;
}

interface UseGoogleLoginHandlerProps {
  onSuccessNavigate: string;
}

export const useGoogleLoginHandler = ({ onSuccessNavigate }: UseGoogleLoginHandlerProps) => {
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();

  const handleCredentialResponse = useCallback(
    async (response: GoogleCredentialResponse) => {
      try {
        const res = await authService.loginWithGoogleIdToken(response.credential);

        localStorage.setItem('token', res.token);
        localStorage.setItem('userProfile', JSON.stringify(res.usuario));

        await refreshProfile();

        if (res.isNewUser) {
          toast.success('¡Cuenta creada e iniciada con éxito! Bienvenido a Prefa-IA');
        } else {
          toast.success('¡Bienvenido de nuevo!');
        }

        navigate(onSuccessNavigate);
      } catch (error: unknown) {
        console.error('Error en login con Google:', error);
        const errorObj = error as { response?: { data?: { error?: string; message?: string } } };
        const mensaje =
          errorObj.response?.data?.error ||
          errorObj.response?.data?.message ||
          'Error al iniciar sesión con Google';

        if (mensaje.includes('inactiva')) {
          toast.error(
            'Tu cuenta está inactiva. Por favor, activa tu cuenta desde el correo electrónico que recibiste al registrarte.'
          );
        } else if (mensaje.includes('ya existe') || mensaje.includes('ya está registrado')) {
          toast.error('Este usuario ya existe. Por favor, inicia sesión con tu contraseña.');
        } else {
          toast.error(mensaje);
        }
      }
    },
    [navigate, onSuccessNavigate, refreshProfile]
  );

  return { handleCredentialResponse };
};
