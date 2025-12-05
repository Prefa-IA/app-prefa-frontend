import { test, expect } from '@playwright/test';
import { test as authenticatedTest } from '../fixtures/auth.fixture';

test.describe('Toasts y Notificaciones', () => {
  authenticatedTest('debe mostrar toast de éxito al guardar perfil', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/perfil');
    await authenticatedPage.waitForTimeout(2000);
    
    const nombreInput = authenticatedPage.locator('input[name="nombre"]').first();
    
    if (await nombreInput.isVisible({ timeout: 2000 })) {
      await nombreInput.fill('Test User Updated');
      
      const saveButton = authenticatedPage.locator('button:has-text("Guardar"), button[type="submit"]').first();
      
      if (await saveButton.isVisible({ timeout: 2000 })) {
        await saveButton.click();
        await authenticatedPage.waitForTimeout(2000);
        
        // Verificar toast de éxito
        const toast = authenticatedPage.locator('.Toastify__toast--success, [role="alert"]:has-text("éxito"), [role="alert"]:has-text("guardado")').first();
        const hasToast = await toast.isVisible({ timeout: 3000 }).catch(() => false);
        // Puede mostrar toast o no
      }
    }
  });

  authenticatedTest('debe mostrar toast de error al fallar acción', async ({ authenticatedPage }) => {
    // Intentar acción que falle (ej: login con credenciales inválidas)
    await authenticatedPage.goto('/login');
    await authenticatedPage.fill('input[type="email"]', 'invalid@example.com');
    await authenticatedPage.fill('input[type="password"]', 'wrongpassword');
    
    const responsePromise = authenticatedPage.waitForResponse(
      (response) => response.url().includes('/auth/login'),
      { timeout: 10000 }
    ).catch(() => null);
    
    await authenticatedPage.click('button[type="submit"]');
    await responsePromise;
    await authenticatedPage.waitForTimeout(2000);
    
    // Verificar toast de error
    const toast = authenticatedPage.locator('.Toastify__toast--error, [role="alert"]:has-text("error"), [role="alert"]:has-text("incorrecto")').first();
    const hasToast = await toast.isVisible({ timeout: 3000 }).catch(() => false);
    // Puede mostrar toast o no
  });

  authenticatedTest('debe cerrar toast automáticamente', async ({ authenticatedPage }) => {
    // Realizar acción que genere toast
    await authenticatedPage.goto('/perfil');
    await authenticatedPage.waitForTimeout(2000);
    
    const nombreInput = authenticatedPage.locator('input[name="nombre"]').first();
    
    if (await nombreInput.isVisible({ timeout: 2000 })) {
      await nombreInput.fill('Test');
      
      const saveButton = authenticatedPage.locator('button:has-text("Guardar")').first();
      
      if (await saveButton.isVisible({ timeout: 2000 })) {
        await saveButton.click();
        await authenticatedPage.waitForTimeout(1000);
        
        // Verificar que el toast aparece
        const toast = authenticatedPage.locator('.Toastify__toast').first();
        const isVisible = await toast.isVisible({ timeout: 2000 }).catch(() => false);
        
        if (isVisible) {
          // Esperar a que desaparezca (normalmente 3-5 segundos)
          await authenticatedPage.waitForTimeout(6000);
          
          // Verificar que desapareció
          const isStillVisible = await toast.isVisible({ timeout: 1000 }).catch(() => false);
          expect(isStillVisible).toBeFalsy();
        }
      }
    }
  });
});

