/**
 * Datos de prueba centralizados
 * 
 * Estos datos se usan en múltiples tests para mantener consistencia
 */

export const testData = {
  addresses: {
    valid: {
      street: 'AGUERO 1987, CABA',
      city: 'Buenos Aires',
      smp: '01-01-001',
    },
    invalid: {
      street: 'Dirección Inexistente 99999',
    },
  },

  users: {
    newUser: {
      nombre: 'Test User',
      email: `test-${Date.now()}@example.com`,
      password: 'Test123!',
      repeatPassword: 'Test123!',
    },
  },

  consultas: {
    basic: {
      tipo: 'basica',
      creditos: 100,
    },
    complete: {
      tipo: 'completa',
      creditos: 200,
    },
    compound: {
      tipo: 'compuesta',
      creditos: 300,
      addresses: [
        { street: 'AGUERO 1987, CABA' },
        { street: 'AGUERO 1987, CABA' },
      ],
    },
  },
} as const;

