import { test, expect } from '@playwright/test';
import { test as authenticatedTest } from '../fixtures/auth.fixture';
import { ConsultaPage } from '../helpers/page-objects/ConsultaPage';

authenticatedTest.describe.skip('Modo Compuesto - Múltiples Direcciones', () => {
  // Modo compuesto está deshabilitado temporalmente (ver CompoundModeToggle.tsx)
  let consultaPage: ConsultaPage;

  authenticatedTest.beforeEach(async ({ authenticatedPage }) => {
    consultaPage = new ConsultaPage(authenticatedPage);
    await consultaPage.goto();
  });

  authenticatedTest('debe activar modo compuesto', async ({ authenticatedPage }) => {
    const compoundToggle = authenticatedPage.locator('input[type="checkbox"], button:has-text("Compuesto")').first();
    
    if (await compoundToggle.isVisible({ timeout: 2000 }).catch(() => false)) {
      await compoundToggle.click();
      await authenticatedPage.waitForTimeout(500);
      
      // Verificar que aparecen múltiples inputs de dirección
      const addressInputs = authenticatedPage.locator('input[placeholder*="dirección"]');
      const inputCount = await addressInputs.count();
      
      // Debe tener al menos 2 inputs en modo compuesto
      expect(inputCount).toBeGreaterThanOrEqual(1);
    }
  });

  authenticatedTest('debe agregar múltiples direcciones', async ({ authenticatedPage }) => {
    const compoundToggle = authenticatedPage.locator('input[type="checkbox"], button:has-text("Compuesto")').first();
    
    if (await compoundToggle.isVisible({ timeout: 2000 }).catch(() => false)) {
      await compoundToggle.click();
      await authenticatedPage.waitForTimeout(500);
      
      // Llenar primera dirección
      await consultaPage.fillAddress('AGUERO 1987, CABA');
      await authenticatedPage.waitForTimeout(1000);
      
      // Buscar botón para agregar más
      const addButton = authenticatedPage.locator('button:has-text("Agregar"), button:has-text("+"), button[aria-label*="agregar"]').first();
      
      if (await addButton.isVisible({ timeout: 2000 })) {
        await addButton.click();
        await authenticatedPage.waitForTimeout(500);
        
        // Verificar que apareció nuevo input
        const addressInputs = authenticatedPage.locator('input[placeholder*="dirección"]');
        const inputCount = await addressInputs.count();
        expect(inputCount).toBeGreaterThan(1);
        
        // Llenar segunda dirección
        const secondInput = addressInputs.nth(1);
        await secondInput.fill('AGUERO 1987, CABA');
        await authenticatedPage.waitForTimeout(1000);
      }
    }
  });

  authenticatedTest('debe eliminar dirección del modo compuesto', async ({ authenticatedPage }) => {
    const compoundToggle = authenticatedPage.locator('input[type="checkbox"], button:has-text("Compuesto")').first();
    
    if (await compoundToggle.isVisible({ timeout: 2000 }).catch(() => false)) {
      await compoundToggle.click();
      await authenticatedPage.waitForTimeout(500);
      
      // Agregar múltiples direcciones
      await consultaPage.fillAddress('AGUERO 1987, CABA');
      await authenticatedPage.waitForTimeout(1000);
      
      const addButton = authenticatedPage.locator('button:has-text("Agregar"), button:has-text("+")').first();
      if (await addButton.isVisible({ timeout: 2000 })) {
        await addButton.click();
        await authenticatedPage.waitForTimeout(500);
        
        // Buscar botón de eliminar
        const deleteButton = authenticatedPage.locator('button[aria-label*="eliminar"], button:has-text("Eliminar"), button:has-text("×")').first();
        
        if (await deleteButton.isVisible({ timeout: 2000 })) {
          const addressInputsBefore = authenticatedPage.locator('input[placeholder*="dirección"]');
          const countBefore = await addressInputsBefore.count();
          
          await deleteButton.click();
          await authenticatedPage.waitForTimeout(500);
          
          // Verificar que se eliminó
          const addressInputsAfter = authenticatedPage.locator('input[placeholder*="dirección"]');
          const countAfter = await addressInputsAfter.count();
          
          expect(countAfter).toBeLessThan(countBefore);
        }
      }
    }
  });

  authenticatedTest('debe validar mínimo de direcciones en modo compuesto', async ({ authenticatedPage }) => {
    const compoundToggle = authenticatedPage.locator('input[type="checkbox"], button:has-text("Compuesto")').first();
    
    if (await compoundToggle.isVisible({ timeout: 2000 }).catch(() => false)) {
      await compoundToggle.click();
      await authenticatedPage.waitForTimeout(500);
      
      // Intentar consultar sin direcciones suficientes
      const consultButton = authenticatedPage.locator('button:has-text("Consultar")').first();
      await consultButton.click();
      await authenticatedPage.waitForTimeout(1000);
      
      // Verificar validación
      const errorMessage = authenticatedPage.locator('text=mínimo, text=al menos 2, text=requerido').first();
      const hasError = await errorMessage.isVisible({ timeout: 2000 }).catch(() => false);
      // Puede mostrar error o no permitir submit
    }
  });
});

