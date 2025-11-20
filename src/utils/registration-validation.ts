import { toast } from 'react-toastify';

import { RegistroData } from '../types/enums';

export const validateRegistrationForm = (datos: RegistroData, aceptoTyC: boolean): boolean => {
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
