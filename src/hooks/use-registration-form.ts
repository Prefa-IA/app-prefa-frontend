import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useAuth } from '../contexts/AuthContext';
import { RegistroData } from '../types/enums';
import { validateRegistrationForm } from '../utils/registration-validation';
import { sanitizePath } from '../utils/url-sanitizer';

import { useCaptcha } from './use-captcha';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    captchaToken,
    captchaValidated,
    recaptchaWidgetIdRef,
    resetKey,
    handleCaptchaVerify,
    handleCaptchaError,
    resetCaptcha,
  } = useCaptcha();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateRegistrationForm(datos, aceptoTyC)) {
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
      const safePath = sanitizePath('/login');
      navigate(safePath);
    } catch (error: unknown) {
      console.error(error);
      resetCaptcha();
    } finally {
      setIsSubmitting(false);
    }
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
    resetKey,
    handleSubmit,
    handleCaptchaVerify,
    handleCaptchaError,
    resetCaptcha,
    toggleTyC,
    openModal,
    closeModal,
  };
};
