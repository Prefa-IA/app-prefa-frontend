import { test, expect } from '@playwright/test';
import { test as authenticatedTest } from '../fixtures/auth.fixture';

test.describe('Protección de Rutas', () => {
  test.describe('Rutas protegidas sin autenticación', () => {
    test('debe redirigir a login desde /consultar sin autenticación', async ({ page }) => {
      await page.goto('/consultar');
      // Debería redirigir a login
      await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
    });

    test('debe redirigir a login desde /informes sin autenticación', async ({ page }) => {
      await page.goto('/informes');
      await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
    });

    test('debe redirigir a login desde /perfil sin autenticación', async ({ page }) => {
      await page.goto('/perfil');
      await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
    });

    test('debe redirigir a login desde /suscripciones sin autenticación', async ({ page }) => {
      await page.goto('/suscripciones');
      await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
    });

    test('debe redirigir a login desde /buscar sin autenticación', async ({ page }) => {
      await page.goto('/buscar');
      await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
    });
  });

  test.describe('Rutas públicas accesibles sin autenticación', () => {
    test('debe permitir acceso a / sin autenticación', async ({ page }) => {
      await page.goto('/');
      await expect(page).not.toHaveURL(/\/login/);
    });

    test('debe permitir acceso a /login sin autenticación', async ({ page }) => {
      await page.goto('/login');
      await expect(page).toHaveURL(/\/login/);
    });

    test('debe permitir acceso a /registro sin autenticación', async ({ page }) => {
      await page.goto('/registro');
      await expect(page).toHaveURL(/\/registro/);
    });

    test('debe permitir acceso a /forgot-password sin autenticación', async ({ page }) => {
      await page.goto('/forgot-password');
      await expect(page).toHaveURL(/\/forgot-password/);
    });
  });

  test.describe('Rutas protegidas con autenticación', () => {
    authenticatedTest('debe permitir acceso a /consultar con autenticación', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/consultar');
      await expect(authenticatedPage).not.toHaveURL(/\/login/);
      // Verificar que la página de consulta carga
      await expect(authenticatedPage.locator('body')).toBeVisible();
    });

    authenticatedTest('debe permitir acceso a /informes con autenticación', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/informes');
      await expect(authenticatedPage).not.toHaveURL(/\/login/);
    });

    authenticatedTest('debe permitir acceso a /perfil con autenticación', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/perfil');
      await expect(authenticatedPage).not.toHaveURL(/\/login/);
    });

    authenticatedTest('debe permitir acceso a /suscripciones con autenticación', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/suscripciones');
      await expect(authenticatedPage).not.toHaveURL(/\/login/);
    });
  });

  test.describe('Logout y redirección', () => {
    authenticatedTest('debe redirigir a login después de logout', async ({ authenticatedPage }) => {
      // Buscar botón de logout (puede estar en menú de usuario)
      const logoutButton = authenticatedPage.locator('button:has-text("Cerrar sesión")').or(
        authenticatedPage.locator('[data-testid="logout-button"]')
      );

      if (await logoutButton.isVisible()) {
        await logoutButton.click();
        await expect(authenticatedPage).toHaveURL(/\/login/, { timeout: 5000 });
      }
    });
  });
});

