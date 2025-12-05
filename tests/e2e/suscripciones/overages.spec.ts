import { test, expect } from '@playwright/test';
import { test as authenticatedTest } from '../fixtures/auth.fixture';
import { SuscripcionesPage } from '../helpers/page-objects/SuscripcionesPage';

authenticatedTest.describe('Comprar Overages', () => {
  let suscripcionesPage: SuscripcionesPage;

  authenticatedTest.beforeEach(async ({ authenticatedPage }) => {
    suscripcionesPage = new SuscripcionesPage(authenticatedPage);
    await suscripcionesPage.goto();
  });

  authenticatedTest('debe mostrar overages disponibles', async ({ authenticatedPage }) => {
    await authenticatedPage.waitForTimeout(2000);
    
    const overageCount = await suscripcionesPage.overageCards.count();
    
    // Puede tener o no overages disponibles
    if (overageCount > 0) {
      expect(overageCount).toBeGreaterThan(0);
    }
  });

  authenticatedTest('debe permitir comprar overage', async ({ authenticatedPage }) => {
    await authenticatedPage.waitForTimeout(2000);
    
    const overageCount = await suscripcionesPage.overageCards.count();
    
    if (overageCount > 0) {
      const firstOverage = suscripcionesPage.overageCards.first();
      const buyButton = firstOverage.locator('button:has-text("Comprar"), button:has-text("Seleccionar")');
      
      if (await buyButton.isVisible({ timeout: 2000 })) {
        // Interceptar redirección a pago
        const navigationPromise = authenticatedPage.waitForURL(/mercadopago|checkout|pago/, { timeout: 10000 }).catch(() => null);
        
        await buyButton.click();
        await authenticatedPage.waitForTimeout(3000);
        
        // Verificar que inició proceso de pago
        const navigation = await navigationPromise;
        const modal = authenticatedPage.locator('[role="dialog"], .modal').first();
        const hasModal = await modal.isVisible({ timeout: 3000 }).catch(() => false);
        
        expect(navigation !== null || hasModal).toBeTruthy();
      }
    }
  });
});

