import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useAuth } from '../contexts/AuthContext';
import { auth as authService } from '../services/api';
import { RegistroData } from '../types/enums';
import { validateRegistrationForm } from '../utils/registration-validation';
import { sanitizePath } from '../utils/url-sanitizer';

import { useCaptcha } from './use-captcha';

const useModalHandlers = () => {
  const [mostrarTyC, setMostrarTyC] = useState(false);
  const openModal = () => setMostrarTyC(true);
  const closeModal = () => setMostrarTyC(false);
  return { mostrarTyC, openModal, closeModal };
};

const useTermsHandlers = () => {
  const [aceptoTyC, setAceptoTyC] = useState(false);
  const toggleTyC = () => setAceptoTyC((prev) => !prev);
  return { aceptoTyC, toggleTyC };
};

const useRegistrationLogic = (
  datos: RegistroData,
  aceptoTyC: boolean,
  captchaToken: string | null,
  captchaValidated: boolean,
  showRecaptcha: boolean,
  setShowRecaptcha: React.Dispatch<React.SetStateAction<boolean>>,
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>,
  resetCaptcha: () => void
) => {
  const navigate = useNavigate();
  const { registro } = useAuth();

  const performRegistration = useCallback(
    async (token: string) => {
      setIsSubmitting(true);
      try {
        const { repeatPassword: _repeatPassword, ...send } = datos;
        await registro({ ...send, acceptedTerms: aceptoTyC, recaptchaToken: token });
        const safePath = sanitizePath('/login');
        navigate(safePath);
      } catch (error: unknown) {
        console.error(error);
        resetCaptcha();
        setShowRecaptcha(false);
      } finally {
        setIsSubmitting(false);
      }
    },
    [datos, aceptoTyC, registro, navigate, resetCaptcha, setShowRecaptcha, setIsSubmitting]
  );

  const handleRegistration = useCallback(async () => {
    if (!captchaToken) {
      toast.error('Por favor completa el captcha');
      return;
    }
    await performRegistration(captchaToken);
  }, [captchaToken, performRegistration]);

  useEffect(() => {
    if (captchaValidated && showRecaptcha && captchaToken) {
      void handleRegistration();
    }
  }, [captchaValidated, showRecaptcha, captchaToken, handleRegistration]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateRegistrationForm(datos, aceptoTyC)) {
      return;
    }

    if (!captchaValidated) {
      try {
        const { available } = await authService.checkEmail(datos.email);
        if (!available) {
          toast.error('Intenta con otro correo o prueba más tarde');
          return;
        }
        setShowRecaptcha(true);
      } catch (error: unknown) {
        toast.error('Intenta con otro correo o prueba más tarde');
        return;
      }
      return;
    }

    await handleRegistration();
  };

  return { handleSubmit };
};

export const useRegistrationForm = () => {
  const [datos, setDatos] = useState<RegistroData>({
    email: '',
    password: '',
    repeatPassword: '',
    nombre: '',
    acceptedTerms: false,
  });
  const [showPass, setShowPass] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRecaptcha, setShowRecaptcha] = useState(false);

  const { aceptoTyC, toggleTyC } = useTermsHandlers();
  const { mostrarTyC, openModal, closeModal } = useModalHandlers();

  const {
    captchaToken,
    captchaValidated,
    recaptchaWidgetIdRef,
    resetKey,
    handleCaptchaVerify,
    handleCaptchaError,
    resetCaptcha,
  } = useCaptcha();

  const { handleSubmit } = useRegistrationLogic(
    datos,
    aceptoTyC,
    captchaToken,
    captchaValidated,
    showRecaptcha,
    setShowRecaptcha,
    setIsSubmitting,
    resetCaptcha
  );

  const handleResetCaptcha = () => {
    resetCaptcha();
    setShowRecaptcha(false);
  };

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
    showRecaptcha,
    handleSubmit,
    handleCaptchaVerify,
    handleCaptchaError,
    resetCaptcha: handleResetCaptcha,
    toggleTyC,
    openModal,
    closeModal,
  };
};
