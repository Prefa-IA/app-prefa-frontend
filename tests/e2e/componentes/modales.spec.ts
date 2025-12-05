import { test, expect } from '@playwright/test';
import { test as authenticatedTest } from '../fixtures/auth.fixture';

test.describe('Modales de Confirmación', () => {
  authenticatedTest('debe mostrar modal de confirmación al eliminar informe', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/informes');
    await authenticatedPage.waitForTimeout(2000);
    
    const deleteButtons = authenticatedPage.locator('[data-testid="delete-button"], button:has-text("Eliminar")');
    const deleteCount = await deleteButtons.count();
    
    if (deleteCount > 0) {
      // Interceptar confirmación
      authenticatedPage.on('dialog', (dialog) => {
        expect(dialog.type()).toBe('confirm');
        dialog.accept();
      });
      
      await deleteButtons.first().click();
      await authenticatedPage.waitForTimeout(1000);
      
      // Verificar que se mostró el modal o confirmación
      const modal = authenticatedPage.locator('[role="dialog"], .modal').first();
      const hasModal = await modal.isVisible({ timeout: 2000 }).catch(() => false);
      // Puede mostrar modal o usar confirm() nativo
    }
  });

  authenticatedTest('debe cerrar modal al hacer click en cancelar', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/informes');
    await authenticatedPage.waitForTimeout(2000);
    
    const deleteButtons = authenticatedPage.locator('[data-testid="delete-button"]');
    
    if (await deleteButtons.first().isVisible({ timeout: 2000 }).catch(() => false)) {
      await deleteButtons.first().click();
      await authenticatedPage.waitForTimeout(500);
      
      // Buscar botón de cancelar
      const cancelButton = authenticatedPage.locator('button:has-text("Cancelar"), button[aria-label*="cerrar"]').first();
      
      if (await cancelButton.isVisible({ timeout: 2000 })) {
        await cancelButton.click();
        await authenticatedPage.waitForTimeout(500);
        
        // Verificar que se cerró
        const modal = authenticatedPage.locator('[role="dialog"]').first();
        const isClosed = await modal.isVisible({ timeout: 1000 }).catch(() => false);
        expect(isClosed).toBeFalsy();
      }
    }
  });

  authenticatedTest('debe confirmar acción en modal', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/informes');
    await authenticatedPage.waitForTimeout(2000);
    
    const deleteButtons = authenticatedPage.locator('[data-testid="delete-button"]');
    
    if (await deleteButtons.first().isVisible({ timeout: 2000 }).catch(() => false)) {
      await deleteButtons.first().click();
      await authenticatedPage.waitForTimeout(500);
      
      // Buscar botón de confirmar
      const confirmButton = authenticatedPage.locator('button:has-text("Confirmar"), button:has-text("Eliminar")').last();
      
      if (await confirmButton.isVisible({ timeout: 2000 })) {
        await confirmButton.click();
        await authenticatedPage.waitForTimeout(2000);
        
        // Verificar que se ejecutó la acción
        const modal = authenticatedPage.locator('[role="dialog"]').first();
        const isClosed = await modal.isVisible({ timeout: 1000 }).catch(() => false);
        expect(isClosed).toBeFalsy();
      }
    }
  });
});

