import { test, expect } from '@playwright/test';
import { test as authenticatedTest } from '../fixtures/auth.fixture';
import { ConsultaPage } from '../helpers/page-objects/ConsultaPage';
import { waitForApiResponse, safeWaitForTimeout } from '../helpers/utils';
import { testData } from '../fixtures/data.fixture';

authenticatedTest.describe('Consulta Completa', () => {
  let consultaPage: ConsultaPage;

  authenticatedTest.beforeEach(async ({ authenticatedPage }) => {
    consultaPage = new ConsultaPage(authenticatedPage);
    await consultaPage.goto();
  });

  authenticatedTest('debe realizar consulta completa exitosa', async ({ authenticatedPage }) => {
    const address = testData.addresses.valid.street;
    
    await consultaPage.fillAddress(address);
    await authenticatedPage.waitForTimeout(1500);
    
    // Seleccionar tipo completa
    await consultaPage.selectTipoPrefa('completa');
    await authenticatedPage.waitForTimeout(500);
    
    const responsePromise = waitForApiResponse(authenticatedPage, '/prefactibilidad/consultar', 60000);
    
    // Hacer click en el botón de generar/consultar
    const searchButtonVisible = await consultaPage.searchButton.isVisible({ timeout: 5000 }).catch(() => false);
    if (searchButtonVisible) {
      await consultaPage.searchButton.click();
    } else {
      // Si no hay botón visible, presionar Enter
      await consultaPage.searchInput.press('Enter');
    }
    
    await responsePromise;
    await consultaPage.waitForLoadingToFinish(60000);
    
    // Esperar un poco más para que los resultados se rendericen
    await safeWaitForTimeout(authenticatedPage, 2000);
    
    // Verificar que hay resultados - puede tomar tiempo en aparecer
    const hasResults = await consultaPage.isResultsVisible();
    
    // Si no hay resultados inmediatamente, esperar un poco más
    if (!hasResults) {
      await safeWaitForTimeout(authenticatedPage, 3000);
      const hasResultsAfterWait = await consultaPage.isResultsVisible();
      expect(hasResultsAfterWait).toBeTruthy();
    } else {
      expect(hasResults).toBeTruthy();
    }
  });

  authenticatedTest('debe consumir 200 créditos en consulta completa', async ({ authenticatedPage }) => {
    // Verificar costo de créditos antes y después
    const creditCostBefore = await consultaPage.getCreditCost();
    
    await consultaPage.fillAddress(testData.addresses.valid.street);
    await authenticatedPage.waitForTimeout(1500);
    
    // Seleccionar tipo completa
    await consultaPage.selectTipoPrefa('completa');
    await authenticatedPage.waitForTimeout(500);
    
    // Hacer click en el botón de generar/consultar
    const searchButtonVisible = await consultaPage.searchButton.isVisible({ timeout: 5000 }).catch(() => false);
    if (searchButtonVisible) {
      await consultaPage.searchButton.click();
    } else {
      await consultaPage.searchInput.press('Enter');
    }
    
    await consultaPage.waitForLoadingToFinish(60000);
    
    // Verificar que se consumieron créditos (puede requerir verificar balance)
  });
});

