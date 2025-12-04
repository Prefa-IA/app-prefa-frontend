export const validateDni = (dni: string): { valid: boolean; error?: string } => {
  if (!dni || typeof dni !== 'string') {
    return { valid: false, error: 'DNI requerido' };
  }

  const cleaned = dni.trim().replace(/[-\s]/g, '');

  if (!/^\d{7,8}$/.test(cleaned)) {
    return { valid: false, error: 'DNI inválido. Debe tener 7 u 8 dígitos' };
  }

  return { valid: true };
};

function calcularDigitoVerificador(cuitSinDigito: string): number {
  const multiplicadores: readonly number[] = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  const suma = multiplicadores.reduce((acc, multiplicador, i) => {
    const digit = cuitSinDigito.charAt(i);
    if (!digit) return acc;
    return acc + parseInt(digit, 10) * multiplicador;
  }, 0);

  const resto = suma % 11;
  if (resto < 2) {
    return resto;
  }
  return 11 - resto;
}

export const validateCuit = (cuit: string): { valid: boolean; error?: string } => {
  if (!cuit || typeof cuit !== 'string') {
    return { valid: false, error: 'CUIT requerido' };
  }

  const cleaned = cuit.trim().replace(/[-\s]/g, '');

  if (!/^\d{11}$/.test(cleaned)) {
    return { valid: false, error: 'CUIT inválido. Debe tener 11 dígitos' };
  }

  const prefijo = cleaned.substring(0, 2);
  const prefijosValidos = ['20', '23', '24', '27', '30', '33', '34'];
  if (!prefijosValidos.includes(prefijo)) {
    return { valid: false, error: 'CUIT inválido. Prefijo no válido' };
  }

  const cuitSinDigito = cleaned.substring(0, 10);
  const digitoVerificadorChar = cleaned[10];
  if (digitoVerificadorChar === undefined) {
    return { valid: false, error: 'CUIT inválido. Debe tener 11 dígitos' };
  }
  const digitoVerificador = parseInt(digitoVerificadorChar, 10);
  const digitoCalculado = calcularDigitoVerificador(cuitSinDigito);

  if (digitoVerificador !== digitoCalculado) {
    return { valid: false, error: 'CUIT inválido. Dígito verificador incorrecto' };
  }

  return { valid: true };
};

export const validateCuil = (cuil: string): { valid: boolean; error?: string } => {
  if (!cuil || typeof cuil !== 'string') {
    return { valid: false, error: 'CUIL requerido' };
  }

  const cleaned = cuil.trim().replace(/[-\s]/g, '');

  if (!/^\d{11}$/.test(cleaned)) {
    return { valid: false, error: 'CUIL inválido. Debe tener 11 dígitos' };
  }

  const prefijo = cleaned.substring(0, 2);
  const prefijosValidos = ['20', '23', '24', '27', '30', '33', '34'];
  if (!prefijosValidos.includes(prefijo)) {
    return { valid: false, error: 'CUIL inválido. Prefijo no válido' };
  }

  const cuilSinDigito = cleaned.substring(0, 10);
  const digitoVerificadorChar = cleaned[10];
  if (digitoVerificadorChar === undefined) {
    return { valid: false, error: 'CUIL inválido. Debe tener 11 dígitos' };
  }
  const digitoVerificador = parseInt(digitoVerificadorChar, 10);
  const digitoCalculado = calcularDigitoVerificador(cuilSinDigito);

  if (digitoVerificador !== digitoCalculado) {
    return { valid: false, error: 'CUIL inválido. Dígito verificador incorrecto' };
  }

  return { valid: true };
};

export const validateNombreApellido = (nombre: string): { valid: boolean; error?: string } => {
  if (!nombre || typeof nombre !== 'string') {
    return { valid: false, error: 'El nombre/apellido es requerido' };
  }

  const trimmed = nombre.trim();

  if (trimmed.length < 2) {
    return { valid: false, error: 'El nombre/apellido debe tener al menos 2 caracteres' };
  }

  if (trimmed.length > 50) {
    return { valid: false, error: 'El nombre/apellido no puede exceder 50 caracteres' };
  }

  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/.test(trimmed)) {
    return {
      valid: false,
      error: 'El nombre/apellido solo puede contener letras, espacios, guiones y apóstrofes',
    };
  }

  if (/^[\s'-]|[\s'-]$/.test(trimmed)) {
    return {
      valid: false,
      error: 'El nombre/apellido no puede empezar ni terminar con espacio, guión o apóstrofe',
    };
  }

  if (/\s{2,}/.test(trimmed)) {
    return {
      valid: false,
      error: 'El nombre/apellido no puede tener espacios múltiples consecutivos',
    };
  }

  return { valid: true };
};

export const validateNombreCompleto = (
  nombreCompleto: string
): { valid: boolean; error?: string } => {
  if (!nombreCompleto || typeof nombreCompleto !== 'string') {
    return { valid: false, error: 'El nombre completo es requerido' };
  }

  const trimmed = nombreCompleto.trim();

  if (trimmed.length < 3) {
    return { valid: false, error: 'El nombre completo debe tener al menos 3 caracteres' };
  }

  if (trimmed.length > 100) {
    return { valid: false, error: 'El nombre completo no puede exceder 100 caracteres' };
  }

  const validacionFormato = validateNombreApellido(trimmed);
  if (!validacionFormato.valid) {
    return validacionFormato;
  }

  const partes = trimmed.split(/\s+/).filter((p) => p.length > 0);
  if (partes.length < 2) {
    return { valid: false, error: 'El nombre completo debe incluir nombre y apellido' };
  }

  for (const parte of partes) {
    const validacionParte = validateNombreApellido(parte);
    if (!validacionParte.valid) {
      return { valid: false, error: `Parte inválida en el nombre completo: ${parte}` };
    }
  }

  return { valid: true };
};

export const validateEmail = (email: string): { valid: boolean; error?: string } => {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email requerido' };
  }

  const trimmed = email.trim().toLowerCase();

  if (trimmed.length === 0) {
    return { valid: false, error: 'Email requerido' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: 'Formato de email inválido' };
  }

  if (trimmed.length > 254) {
    return { valid: false, error: 'El email no puede exceder 254 caracteres' };
  }

  return { valid: true };
};
