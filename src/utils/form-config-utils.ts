import { FormField, InputType } from '../types/enums';

export const REGISTRATION_FORM_FIELDS: FormField[] = [
  {
    id: 'nombre',
    name: 'nombre',
    type: InputType.TEXT,
    label: 'Nombre de la empresa',
    placeholder: 'Ej: Estudio Arquitectura XYZ',
    required: true,
    maxLength: 26,
  },
  {
    id: 'email',
    name: 'email',
    type: InputType.EMAIL,
    label: 'Email',
    placeholder: 'Correo@ejemplo.com',
    required: true,
    autoComplete: 'email',
  },
  {
    id: 'password',
    name: 'password',
    type: InputType.PASSWORD,
    label: 'Contraseña',
    placeholder: 'Contraseña',
    required: true,
    autoComplete: 'new-password',
  },
  {
    id: 'repeatPassword',
    name: 'repeatPassword',
    type: InputType.PASSWORD,
    label: 'Repetir Contraseña',
    placeholder: 'Repite la contraseña',
    required: true,
    autoComplete: 'new-password',
  },
];

export const createFieldValidator =
  (field: FormField) =>
  (value: string): boolean => {
    if (field.required && !value.trim()) {
      return false;
    }

    if (field.type === InputType.EMAIL) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    }

    if (field.type === InputType.PASSWORD) {
      return value.length >= 6;
    }

    return true;
  };

export const validateFormData = (
  data: Record<string, string>,
  fields: FormField[]
): Record<string, string> => {
  const errors: Record<string, string> = {};

  fields.forEach((field) => {
    const value = data[field.name];
    const validator = createFieldValidator(field);

    if (value === undefined || value === null || !validator(value)) {
      if (field.required && !value?.trim()) {
        errors[field.name] = `${field.label} es requerido`;
      } else if (field.type === InputType.EMAIL) {
        errors[field.name] = 'Email inválido';
      } else if (field.type === InputType.PASSWORD) {
        errors[field.name] = 'La contraseña debe tener al menos 6 caracteres';
      }
    }
  });

  return errors;
};
