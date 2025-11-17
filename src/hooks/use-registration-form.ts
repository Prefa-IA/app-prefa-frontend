import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useAuth } from '../contexts/AuthContext';
import { RegistroData } from '../types/enums';
import { sanitizePath } from '../utils/url-sanitizer';

export const useRegistrationForm = () => {
  const navigate = useNavigate();
  const { registro } = useAuth();
  const [datos, setDatos] = useState<RegistroData>({
    email: '',
    password: '',
    repeatPassword: '',
    nombre: '',
    acceptedTerms: false,
  });
  const [showPass, setShowPass] = useState(false);
  const [aceptoTyC, setAceptoTyC] = useState(false);
  const [mostrarTyC, setMostrarTyC] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaValidated, setCaptchaValidated] = useState(false);
  const recaptchaWidgetIdRef = useRef<number | null>(null);

  const validateForm = (): boolean => {
    if (datos.password !== datos.repeatPassword) {
      toast.error('Las contraseñas no coinciden');
      return false;
    }
    const strong = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!strong.test(datos.password)) {
      toast.error('La contraseña debe tener al menos 6 caracteres, una mayúscula y un número');
      return false;
    }
    if (datos.nombre.trim().length > 26) {
      toast.error('El nombre de la empresa excede los caracteres permitidos');
      return false;
    }
    if (!aceptoTyC) {
      toast.error('Debes aceptar los términos y condiciones');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!captchaToken) {
      toast.error('Por favor completa el captcha');
      return;
    }

    setIsSubmitting(true);
    try {
      const { repeatPassword: _repeatPassword, ...send } = datos;
      await registro({ ...send, acceptedTerms: aceptoTyC, recaptchaToken: captchaToken });
      setCaptchaValidated(true);
      const safePath = sanitizePath('/login');
      navigate(safePath);
    } catch (error: unknown) {
      console.error(error);
      const errorObj = error as { response?: { data?: { error?: string } } };
      toast.error(errorObj?.response?.data?.error || 'Error al registrar usuario');
      setCaptchaToken(null);
      setCaptchaValidated(false);
      if (
        recaptchaWidgetIdRef.current !== null &&
        typeof window !== 'undefined' &&
        window.grecaptcha
      ) {
        try {
          window.grecaptcha.reset(recaptchaWidgetIdRef.current);
        } catch (err) {
          console.error('Error reseteando reCAPTCHA:', err);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCaptchaVerify = (token: string) => {
    setCaptchaToken(token);
    setCaptchaValidated(true);
  };

  const handleCaptchaError = () => {
    toast.error('Error al verificar el captcha. Por favor intenta nuevamente.');
    setCaptchaToken(null);
    setCaptchaValidated(false);
  };

  const toggleTyC = () => setAceptoTyC((prev) => !prev);
  const openModal = () => setMostrarTyC(true);
  const closeModal = () => setMostrarTyC(false);

  return {
    datos,
    setDatos,
    showPass,
    setShowPass,
    aceptoTyC,
    mostrarTyC,
    captchaToken,
    captchaValidated,
    isSubmitting,
    recaptchaWidgetIdRef,
    handleSubmit,
    handleCaptchaVerify,
    handleCaptchaError,
    toggleTyC,
    openModal,
    closeModal,
  };
};
