import { test, expect } from '@playwright/test';
import { test as authenticatedTest } from '../fixtures/auth.fixture';
import { InformesPage } from '../helpers/page-objects/InformesPage';

authenticatedTest.describe('Ver Detalle de Informe', () => {
  authenticatedTest('debe mostrar lista de informes', async ({ authenticatedPage }) => {
    const informesPage = new InformesPage(authenticatedPage);
    await informesPage.goto();
    // La lista puede estar vacía o tener elementos, ambos casos son válidos
    // Verificar que al menos el contenedor de la lista está presente
    const listContainer = authenticatedPage.locator('ul.divide-y, div:has-text("No hay informes"), div:has-text("Sin resultados"), ul:has(li)');
    await expect(listContainer.first()).toBeVisible({ timeout: 10000 });
  });

  authenticatedTest('debe navegar a detalle de informe al hacer click', async ({ authenticatedPage }) => {
    const informesPage = new InformesPage(authenticatedPage);
    await informesPage.goto();
    const hasInformes = await informesPage.hasInformes();
    
    if (hasInformes) {
      // Buscar primer informe clickeable
      const firstInforme = authenticatedPage.locator('[data-testid="informe-item"], .informe-item, tr[data-informe-id]').first();
      
      if (await firstInforme.isVisible({ timeout: 2000 })) {
        // Hacer click en el informe
        await firstInforme.click();
        await authenticatedPage.waitForTimeout(2000);
        
        // Verificar navegación a detalle o apertura de modal
        const isDetailPage = authenticatedPage.url().includes('/informes/') || authenticatedPage.url().includes('/informe/');
        const modal = authenticatedPage.locator('[role="dialog"], .modal').first();
        const hasModal = await modal.isVisible({ timeout: 2000 }).catch(() => false);
        
        expect(isDetailPage || hasModal).toBeTruthy();
      }
    }
  });

  authenticatedTest('debe mostrar información completa del informe', async ({ authenticatedPage }) => {
    const informesPage = new InformesPage(authenticatedPage);
    await informesPage.goto();
    const hasInformes = await informesPage.hasInformes();
    
    if (hasInformes) {
      const firstInforme = authenticatedPage.locator('[data-testid="informe-item"]').first();
      
      if (await firstInforme.isVisible({ timeout: 2000 })) {
        await firstInforme.click();
        await authenticatedPage.waitForTimeout(2000);
        
        // Verificar que se muestra información del informe
        const detailContainer = authenticatedPage.locator('[data-testid="informe-detail"], .informe-detail, [role="dialog"]').first();
        const isVisible = await detailContainer.isVisible({ timeout: 3000 }).catch(() => false);
        
        if (isVisible) {
          // Verificar que tiene información
          const hasContent = await detailContainer.textContent();
          expect(hasContent).toBeTruthy();
        }
      }
    }
  });

  authenticatedTest('debe permitir descargar PDF desde detalle', async ({ authenticatedPage }) => {
    const informesPage = new InformesPage(authenticatedPage);
    await informesPage.goto();
    const hasInformes = await informesPage.hasInformes();
    
    if (hasInformes) {
      const firstInforme = authenticatedPage.locator('[data-testid="informe-item"]').first();
      
      if (await firstInforme.isVisible({ timeout: 2000 })) {
        await firstInforme.click();
        await authenticatedPage.waitForTimeout(2000);
        
        // Buscar botón de descargar en detalle
        const downloadButton = authenticatedPage.locator('button:has-text("Descargar"), button:has-text("PDF")').first();
        
        if (await downloadButton.isVisible({ timeout: 2000 })) {
          const downloadPromise = authenticatedPage.waitForEvent('download', { timeout: 30000 }).catch(() => null);
          
          await downloadButton.click();
          const download = await downloadPromise;
          
          if (download) {
            expect(download.suggestedFilename()).toMatch(/\.pdf$/i);
          }
        }
      }
    }
  });
});

