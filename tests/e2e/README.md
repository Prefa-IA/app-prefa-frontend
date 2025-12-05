# Tests E2E con Playwright

Este directorio contiene los tests end-to-end automatizados usando Playwright.

## Estructura

```
tests/e2e/
├── fixtures/          # Fixtures y datos de prueba
├── helpers/          # Helpers y utilidades
│   ├── page-objects/ # Page Object Models
│   ├── selectors.ts  # Selectores centralizados
│   └── utils.ts      # Utilidades compartidas
├── smoke/            # Tests de smoke (verificación básica)
├── auth/             # Tests de autenticación
├── consultas/        # Tests de consultas
├── informes/         # Tests de informes
└── ...
```

## Ejecutar Tests

```bash
# Ejecutar todos los tests
npm run test:e2e

# Ejecutar con UI interactiva
npm run test:e2e:ui

# Ejecutar en modo debug
npm run test:e2e:debug

# Ejecutar en modo headed (ver el navegador)
npm run test:e2e:headed

# Ver reporte HTML
npm run test:e2e:report

# Generar código con Codegen
npm run test:e2e:codegen
```

## Convenciones

### Selectores

- Usar `data-testid` en lugar de clases CSS o IDs
- Centralizar selectores en `helpers/selectors.ts`
- Usar nombres descriptivos: `[data-testid="login-button"]`

### Page Objects

- Cada página debe tener su Page Object en `helpers/page-objects/`
- Los Page Objects encapsulan toda la lógica de interacción
- Los tests deben usar Page Objects, no selectores directos

### Fixtures

- Usar fixtures para estado compartido (autenticación, datos de prueba)
- Fixtures en `fixtures/` directory

## Agregar Nuevos Tests

1. Crear el archivo `.spec.ts` en la carpeta correspondiente
2. Usar Page Objects cuando sea posible
3. Usar selectores centralizados
4. Seguir el patrón de los tests existentes

## Más Información

Ver documentación completa en:
- `prefa-infra/docs/development/PLAYWRIGHT_TESTING_PLAN.md`
- `prefa-infra/docs/development/PLAYWRIGHT_QUICKSTART.md`

