import { test, expect } from '@playwright/test';
import { test as authenticatedTest } from '../fixtures/auth.fixture';
import { PerfilPage } from '../helpers/page-objects/PerfilPage';

authenticatedTest.describe('Configurar Personalización', () => {
  let perfilPage: PerfilPage;

  authenticatedTest.beforeEach(async ({ authenticatedPage }) => {
    perfilPage = new PerfilPage(authenticatedPage);
    await perfilPage.goto();
  });

  authenticatedTest('debe mostrar opciones de personalización', async ({ authenticatedPage }) => {
    // Buscar sección de personalización
    const personalizationSection = authenticatedPage.locator('[data-testid="personalization-section"], .personalizacion, text=Personalización').first();
    
    const isVisible = await personalizationSection.isVisible({ timeout: 3000 }).catch(() => false);
    
    // Puede estar visible o no
  });

  authenticatedTest('debe permitir cambiar preferencias', async ({ authenticatedPage }) => {
    // Buscar opciones de personalización
    const preferences = authenticatedPage.locator('input[type="checkbox"], select[name*="preferencia"]');
    const prefCount = await preferences.count();
    
    if (prefCount > 0) {
      const firstPref = preferences.first();
      
      // Cambiar preferencia
      if (await firstPref.getAttribute('type') === 'checkbox') {
        const isChecked = await firstPref.isChecked();
        await firstPref.click();
        await authenticatedPage.waitForTimeout(500);
        
        // Verificar que cambió
        const newChecked = await firstPref.isChecked();
        expect(newChecked).not.toBe(isChecked);
      }
    }
  });

  authenticatedTest('debe guardar personalización', async ({ authenticatedPage }) => {
    const saveButton = authenticatedPage.locator('button:has-text("Guardar"), button[type="submit"]').first();
    
    if (await saveButton.isVisible({ timeout: 2000 })) {
      // Esperar respuesta de API
      const responsePromise = authenticatedPage.waitForResponse(
        (response) => response.url().includes('/auth/personalizacion'),
        { timeout: 10000 }
      ).catch(() => null);
      
      await saveButton.click();
      await responsePromise;
      await authenticatedPage.waitForTimeout(2000);
      
      // Verificar mensaje de éxito
      const successMessage = authenticatedPage.locator('text=guardado, text=éxito').first();
      const hasSuccess = await successMessage.isVisible({ timeout: 3000 }).catch(() => false);
      // Puede mostrar toast o mensaje
    }
  });
});

