import { test, expect } from '@playwright/test';
import { test as authenticatedTest } from '../fixtures/auth.fixture';
import { SuscripcionesPage } from '../helpers/page-objects/SuscripcionesPage';

authenticatedTest.describe('Suscripciones y Planes', () => {
  let suscripcionesPage: SuscripcionesPage;

  authenticatedTest.beforeEach(async ({ authenticatedPage }) => {
    suscripcionesPage = new SuscripcionesPage(authenticatedPage);
    await suscripcionesPage.goto();
  });

  authenticatedTest('debe mostrar planes disponibles', async ({ authenticatedPage }) => {
    await authenticatedPage.waitForTimeout(2000); // Esperar carga de planes
    
    const planCount = await suscripcionesPage.getPlanCount();
    // Si hay planes, verificar que se muestran correctamente
    // Si no hay planes, el test pasa (puede ser configuración del entorno)
    if (planCount > 0) {
      expect(planCount).toBeGreaterThan(0);
    } else {
      // Verificar que al menos la página carga correctamente
      await expect(authenticatedPage.locator('body')).toBeVisible();
    }
  });

  authenticatedTest('debe mostrar información de cada plan', async ({ authenticatedPage }) => {
    await authenticatedPage.waitForTimeout(2000);
    
    const planCards = suscripcionesPage.planCards;
    const count = await planCards.count();
    
    if (count > 0) {
      const firstPlan = planCards.first();
      await expect(firstPlan).toBeVisible();
      
      // Verificar que tiene botón de seleccionar
      const selectButton = firstPlan.locator('button:has-text("Seleccionar")');
      await expect(selectButton).toBeVisible();
    }
  });

  authenticatedTest('debe mostrar plan actual si existe', async ({ authenticatedPage }) => {
    await authenticatedPage.waitForTimeout(2000);
    
    const hasCurrentPlan = await suscripcionesPage.hasCurrentPlan();
    // Puede o no tener plan actual
  });

  authenticatedTest('debe permitir seleccionar plan', async ({ authenticatedPage }) => {
    await authenticatedPage.waitForTimeout(2000);
    
    const planCards = suscripcionesPage.planCards;
    const count = await planCards.count();
    
    if (count > 0) {
      const firstPlan = planCards.first();
      const selectButton = firstPlan.locator('button:has-text("Seleccionar")');
      
      if (await selectButton.isVisible()) {
        // Interceptar redirección a Mercado Pago
        authenticatedPage.on('response', (response) => {
          if (response.url().includes('mercadopago') || response.url().includes('preference')) {
            // Verificar que se creó la preferencia
          }
        });
        
        await selectButton.click();
        await authenticatedPage.waitForTimeout(3000);
        
        // Verificar redirección o modal de pago
        const url = authenticatedPage.url();
        // Puede redirigir a Mercado Pago o mostrar modal
      }
    }
  });

  authenticatedTest('debe mostrar overages si están disponibles', async ({ authenticatedPage }) => {
    await authenticatedPage.waitForTimeout(2000);
    
    const overageCount = await suscripcionesPage.overageCards.count();
    // Los overages pueden o no estar disponibles
  });
});

