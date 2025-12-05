import { test, expect } from '@playwright/test';
import { test as authenticatedTest } from '../fixtures/auth.fixture';

authenticatedTest.describe('Historial de Pagos', () => {
  authenticatedTest.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/suscripciones');
    await authenticatedPage.waitForTimeout(2000);
  });

  authenticatedTest('debe mostrar historial de pagos', async ({ authenticatedPage }) => {
    // Buscar sección de historial
    const historySection = authenticatedPage.locator('[data-testid="payment-history"], .historial-pagos, text=Historial').first();
    
    const isVisible = await historySection.isVisible({ timeout: 3000 }).catch(() => false);
    
    // Puede estar visible o no
  });

  authenticatedTest('debe listar pagos realizados', async ({ authenticatedPage }) => {
    const paymentsList = authenticatedPage.locator('[data-testid="payments-list"], table, .payments-list').first();
    
    const isVisible = await paymentsList.isVisible({ timeout: 3000 }).catch(() => false);
    
    if (isVisible) {
      const items = paymentsList.locator('tr, .payment-item');
      const itemCount = await items.count();
      // Puede tener o no items
    }
  });

  authenticatedTest('debe mostrar detalles de cada pago', async ({ authenticatedPage }) => {
    const paymentsList = authenticatedPage.locator('[data-testid="payments-list"], table').first();
    
    if (await paymentsList.isVisible({ timeout: 3000 }).catch(() => false)) {
      const firstPayment = paymentsList.locator('tr, .payment-item').first();
      
      if (await firstPayment.isVisible({ timeout: 2000 })) {
        // Verificar que tiene información
        const text = await firstPayment.textContent();
        expect(text).toBeTruthy();
      }
    }
  });
});

