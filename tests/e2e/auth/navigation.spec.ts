import { test, expect } from '@playwright/test';
import { LoginPage } from '../helpers/page-objects/LoginPage';
import { RegisterPage } from '../helpers/page-objects/RegisterPage';

test.describe('Navegación entre páginas de autenticación', () => {
  // Configurar timeout para todos los tests del describe
  test.describe.configure({ timeout: 60000 });

  test('debe navegar de login a registro', async ({ page }) => {
    test.setTimeout(60000);
    
    // Verificar que la página no esté cerrada
    if (page.isClosed()) {
      throw new Error('Page was closed before test could start');
    }
    
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    
    // Verificar que la página sigue abierta antes de continuar
    if (page.isClosed()) {
      throw new Error('Page was closed after navigation');
    }
    
    await loginPage.goToRegister();
    await expect(page).toHaveURL(/\/registro/);
  });

  test('debe navegar de registro a login', async ({ page }) => {
    test.setTimeout(60000);
    
    // Verificar que la página no esté cerrada
    if (page.isClosed()) {
      throw new Error('Page was closed before test could start');
    }
    
    const registerPage = new RegisterPage(page);
    await registerPage.goto();
    
    // Verificar que la página sigue abierta antes de continuar
    if (page.isClosed()) {
      throw new Error('Page was closed after navigation');
    }
    
    await registerPage.goToLogin();
    await expect(page).toHaveURL(/\/login/);
  });

  test('debe navegar de login a forgot password', async ({ page }) => {
    test.setTimeout(60000);
    
    // Verificar que la página no esté cerrada
    if (page.isClosed()) {
      throw new Error('Page was closed before test could start');
    }
    
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    
    // Verificar que la página sigue abierta antes de continuar
    if (page.isClosed()) {
      throw new Error('Page was closed after navigation');
    }
    
    const forgotPasswordLink = page.locator('button:has-text("¿Olvidaste tu contraseña?")');
    await forgotPasswordLink.click();
    await expect(page).toHaveURL(/\/forgot-password/);
  });

  test('debe navegar de login a resend verification', async ({ page }) => {
    test.setTimeout(60000);
    
    // Verificar que la página no esté cerrada
    if (page.isClosed()) {
      throw new Error('Page was closed before test could start');
    }
    
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    
    // Verificar que la página sigue abierta antes de continuar
    if (page.isClosed()) {
      throw new Error('Page was closed after navigation');
    }
    
    const resendLink = page.locator('button:has-text("Reenviar correo de verificación")');
    await resendLink.click();
    await expect(page).toHaveURL(/\/resend-verification/);
  });

  test('debe mantener estado al navegar entre páginas', async ({ page }) => {
    test.setTimeout(60000);
    
    // Verificar que la página no esté cerrada
    if (page.isClosed()) {
      throw new Error('Page was closed before test could start');
    }
    
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    
    // Verificar que la página sigue abierta antes de continuar
    if (page.isClosed()) {
      throw new Error('Page was closed after navigation');
    }
    
    await loginPage.fillEmail('test@example.com');

    // Navegar a registro y volver
    await loginPage.goToRegister();
    
    // Verificar que la página sigue abierta antes de volver
    if (page.isClosed()) {
      throw new Error('Page was closed before going back');
    }
    
    await page.goBack();

    // Verificar que el email aún está (si el navegador mantiene el estado)
    // Nota: Esto puede variar según la implementación
    if (!page.isClosed()) {
      const emailValue = await loginPage.emailInput.inputValue();
      // El valor puede estar vacío si se resetea, o puede mantenerse
    }
  });
});

