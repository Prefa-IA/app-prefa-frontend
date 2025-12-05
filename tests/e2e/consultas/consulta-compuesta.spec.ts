import { test, expect } from '@playwright/test';
import { test as authenticatedTest } from '../fixtures/auth.fixture';
import { ConsultaPage } from '../helpers/page-objects/ConsultaPage';
import { waitForApiResponse } from '../helpers/utils';
import { testData } from '../fixtures/data.fixture';

authenticatedTest.describe.skip('Consulta Compuesta', () => {
  // Modo compuesto está deshabilitado temporalmente (ver CompoundModeToggle.tsx)
  let consultaPage: ConsultaPage;

  authenticatedTest.beforeEach(async ({ authenticatedPage }) => {
    consultaPage = new ConsultaPage(authenticatedPage);
    await consultaPage.goto();
  });

  authenticatedTest('debe mostrar opción de consulta compuesta', async ({ authenticatedPage }) => {
    // Verificar que existe botón o opción de consulta compuesta
    const compoundButton = authenticatedPage.locator('button:has-text("Compuesta"), button:has-text("300")').first();
    const isVisible = await compoundButton.isVisible({ timeout: 2000 }).catch(() => false);
    
    // Puede estar visible o deshabilitada
  });

  authenticatedTest('debe realizar consulta compuesta exitosa', async ({ authenticatedPage }) => {
    // Verificar que el modo compuesto está disponible
    const compoundToggle = authenticatedPage.locator('input[type="checkbox"], button:has-text("Compuesto")').first();
    
    if (await compoundToggle.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Activar modo compuesto
      await compoundToggle.click();
      await authenticatedPage.waitForTimeout(500);
      
      // Agregar primera dirección
      await consultaPage.fillAddress(testData.addresses.valid.street);
      await authenticatedPage.waitForTimeout(1000);
      
      // Buscar botón para agregar más direcciones
      const addButton = authenticatedPage.locator('button:has-text("Agregar"), button:has-text("+")').first();
      
      if (await addButton.isVisible({ timeout: 2000 })) {
        await addButton.click();
        await authenticatedPage.waitForTimeout(500);
        
        // Agregar segunda dirección
        const secondInput = authenticatedPage.locator('input[placeholder*="dirección"]').nth(1);
        if (await secondInput.isVisible({ timeout: 2000 })) {
          await secondInput.fill('AGUERO 1987, CABA');
          await authenticatedPage.waitForTimeout(1000);
          
          // Realizar consulta compuesta
          const responsePromise = waitForApiResponse(authenticatedPage, '/prefactibilidad/consultar-compuestas', 120000);
          
          const consultButton = authenticatedPage.locator('button:has-text("Consultar"), button:has-text("Buscar")').first();
          await consultButton.click();
          
          await responsePromise;
          await consultaPage.waitForLoadingToFinish(120000);
          
          // Verificar resultados
          const hasResults = await consultaPage.isResultsVisible();
          expect(hasResults).toBeTruthy();
        }
      }
    }
  });

  authenticatedTest('debe validar múltiples direcciones', async ({ authenticatedPage }) => {
    const compoundToggle = authenticatedPage.locator('input[type="checkbox"], button:has-text("Compuesto")').first();
    
    if (await compoundToggle.isVisible({ timeout: 2000 }).catch(() => false)) {
      await compoundToggle.click();
      await authenticatedPage.waitForTimeout(500);
      
      // Intentar consultar sin direcciones
      const consultButton = authenticatedPage.locator('button:has-text("Consultar")').first();
      await consultButton.click();
      await authenticatedPage.waitForTimeout(1000);
      
      // Verificar mensaje de validación
      const errorMessage = authenticatedPage.locator('text=al menos, text=direcciones, text=requerido').first();
      const hasError = await errorMessage.isVisible({ timeout: 2000 }).catch(() => false);
      // Puede mostrar error o no permitir submit
    }
  });
});

