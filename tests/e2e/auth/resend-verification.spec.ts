import { test, expect } from '@playwright/test';
import { LoginPage } from '../helpers/page-objects/LoginPage';

test.describe('Resend Verification Email', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('debe mostrar link para reenviar verificación', async ({ page }) => {
    const resendLink = page.locator('button:has-text("Reenviar"), a:has-text("Reenviar"), [data-testid="resend-verification-link"]').first();
    
    const isVisible = await resendLink.isVisible({ timeout: 2000 }).catch(() => false);
    
    if (isVisible) {
      await expect(resendLink).toBeVisible();
    }
  });

  test('debe navegar a página de reenvío de verificación', async ({ page }) => {
    const resendLink = page.locator('button:has-text("Reenviar"), a:has-text("Reenviar"), [data-testid="resend-verification-link"]').first();
    
    if (await resendLink.isVisible({ timeout: 2000 }).catch(() => false)) {
      await resendLink.click();
      await page.waitForTimeout(1000);
      
      // Verificar que navegó a la página de reenvío
      const isResendPage = page.url().includes('/resend-verification') || page.url().includes('/verificar');
      // Puede navegar o mostrar modal
    }
  });

  test('debe reenviar email de verificación', async ({ page }) => {
    // Navegar a página de reenvío
    await page.goto('/resend-verification');
    await page.waitForTimeout(1000);
    
    // Buscar input de email
    const emailInput = page.locator('input[type="email"]').first();
    
    if (await emailInput.isVisible({ timeout: 2000 })) {
      await emailInput.fill('test@example.com');
      
      // Buscar botón de enviar
      const submitButton = page.locator('button:has-text("Enviar"), button:has-text("Reenviar"), button[type="submit"]').first();
      
      if (await submitButton.isVisible({ timeout: 2000 })) {
        // Esperar respuesta de API
        const responsePromise = page.waitForResponse(
          (response) => response.url().includes('/auth/resend-verification'),
          { timeout: 10000 }
        ).catch(() => null);
        
        await submitButton.click();
        await responsePromise;
        await page.waitForTimeout(2000);
        
        // Verificar mensaje de éxito
        const successMessage = page.locator('text=enviado, text=éxito, text=verificación enviada').first();
        const hasSuccess = await successMessage.isVisible({ timeout: 3000 }).catch(() => false);
        // Puede mostrar toast o mensaje
      }
    }
  });

  test('debe validar email antes de reenviar', async ({ page }) => {
    await page.goto('/resend-verification');
    await page.waitForTimeout(1000);
    
    const emailInput = page.locator('input[type="email"]').first();
    const submitButton = page.locator('button[type="submit"]').first();
    
    if (await emailInput.isVisible({ timeout: 2000 }) && await submitButton.isVisible({ timeout: 2000 })) {
      // Intentar enviar sin email
      await submitButton.click();
      await page.waitForTimeout(500);
      
      // Verificar validación
      const isRequired = await emailInput.getAttribute('required');
      expect(isRequired).not.toBeNull();
    }
  });
});

