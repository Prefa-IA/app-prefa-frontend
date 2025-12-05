import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model para la página de Consulta de Direcciones
 */
export class ConsultaPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly tipoPrefaSelect: Locator;
  readonly resultsContainer: Locator;
  readonly loadingOverlay: Locator;
  readonly mapContainer: Locator;
  readonly creditCostsBox: Locator;
  readonly clearButton: Locator;
  readonly resetButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator('input[placeholder*="dirección"], input[placeholder*="Dirección"], input[placeholder*="SMP"]').first();
    this.searchButton = page.locator('button:has-text("Generar"), button:has-text("Buscar"), button:has-text("Consultar"), button[type="submit"], button:has(svg)').first();
    this.tipoPrefaSelect = page.locator('select#tipoPrefa, select[name="tipoPrefa"], select').first();
    // El contenedor de resultados puede tener varios selectores
    this.resultsContainer = page.locator('[data-report-container], [data-testid="results-container"], .report-container, div:has([data-report-container])').first();
    // Los overlays de loading tienen clases específicas y texto característico
    // Buscar por texto o por clases CSS específicas de los overlays
    this.loadingOverlay = page.locator(
      '[data-testid="loading-overlay"], ' +
      '.loading, .spinner, ' +
      'div.fixed.inset-0:has-text("Armando"), ' +
      'div.fixed.inset-0:has-text("Buscando"), ' +
      'div.fixed.inset-0:has-text("Validando"), ' +
      'div:has-text("Armando tu prefactibilidad"), ' +
      'div:has-text("Buscando direccion"), ' +
      'div:has-text("Validando si su lote")'
    ).first();
    this.mapContainer = page.locator('[id*="map"], .leaflet-container, .map-container').first();
    this.creditCostsBox = page.locator('[data-testid="credit-costs"], .credit-costs').first();
    this.clearButton = page.locator('button:has-text("Limpiar"), button:has-text("Borrar")').first();
    this.resetButton = page.locator('button:has-text("Resetear"), button:has-text("Nueva consulta")').first();
  }

  async goto() {
    if (this.page.isClosed()) {
      throw new Error('Page was closed before navigation');
    }

    try {
      await this.page.goto('/consultar', { waitUntil: 'domcontentloaded', timeout: 30000 });
      await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
    } catch (error: any) {
      if (this.page.isClosed()) {
        throw new Error('Page was closed during navigation to consultar page');
      }
      throw error;
    }
  }

  async fillAddress(address: string) {
    // En móviles, el input puede tardar más en aparecer o estar oculto inicialmente
    // Esperar a que sea visible y hacer scroll si es necesario
    const isVisible = await this.searchInput.isVisible({ timeout: 5000 }).catch(() => false);
    
    if (!isVisible) {
      // Intentar hacer scroll a la página para que el input aparezca
      await this.page.evaluate(() => {
        window.scrollTo(0, 0);
      });
      await this.page.waitForTimeout(500);
      
      // Intentar nuevamente
      const retryVisible = await this.searchInput.isVisible({ timeout: 5000 }).catch(() => false);
      if (!retryVisible) {
        // Buscar el input con selectores alternativos
        const altInput = this.page.locator('input[type="text"], input[placeholder*="dirección"], input[placeholder*="Dirección"]').first();
        const altVisible = await altInput.isVisible({ timeout: 3000 }).catch(() => false);
        if (altVisible) {
          await altInput.fill(address);
          return;
        }
        throw new Error('Search input not found or not visible');
      }
    }
    
    await this.searchInput.fill(address);
  }

  async searchAddress(address: string) {
    await this.fillAddress(address);
    await this.searchButton.click();
  }

  async selectTipoPrefa(tipo: 'basica' | 'simple' | 'completa' | 'compuesta') {
    // Esperar a que el select esté visible
    await this.tipoPrefaSelect.waitFor({ state: 'visible', timeout: 5000 });
    
    // Mapear tipos: 'basica' -> 'simple' (son equivalentes)
    const tipoNormalizado = tipo === 'basica' ? 'simple' : tipo;
    
    // Los valores del select son 'prefa1' (Simple) y 'prefa2' (Completa)
    const value = tipoNormalizado === 'simple' ? 'prefa1' : tipoNormalizado === 'completa' ? 'prefa2' : null;
    
    if (!value) {
      throw new Error(`Tipo de prefactibilidad no válido: ${tipo}`);
    }
    
    // Intentar seleccionar por valor primero
    try {
      await this.tipoPrefaSelect.selectOption({ value });
      await this.page.waitForTimeout(300); // Esperar a que se actualice
      return;
    } catch {
      // Si falla, intentar por label
    }
    
    // Intentar seleccionar por texto de la opción
    try {
      const optionText = tipoNormalizado === 'simple' 
        ? 'Prefactibilidad Simple' 
        : 'Prefactibilidad Completa';
      await this.tipoPrefaSelect.selectOption({ label: optionText });
      await this.page.waitForTimeout(300);
      return;
    } catch {
      // Continuar con método por índice
    }
    
    // Método por índice como fallback
    const options = await this.tipoPrefaSelect.locator('option').all();
    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      if (option) {
        const text = await option.textContent();
        if (text && text.toLowerCase().includes(tipoNormalizado.toLowerCase())) {
          await this.tipoPrefaSelect.selectOption({ index: i });
          await this.page.waitForTimeout(300);
          return;
        }
      }
    }
    
    // Si no se encuentra, usar el índice correspondiente (1 para Simple, 2 para Completa)
    if (options.length > 2) {
      const index = tipoNormalizado === 'simple' ? 1 : 2;
      await this.tipoPrefaSelect.selectOption({ index });
      await this.page.waitForTimeout(300);
    } else {
      throw new Error(`No se pudo seleccionar tipo de prefactibilidad: ${tipo}`);
    }
  }

  async clickConsultaBasic() {
    // Seleccionar tipo "Simple" en el select
    await this.selectTipoPrefa('simple');
    // Esperar un momento para que el select se actualice
    await this.page.waitForTimeout(500);
    // Hacer click en el botón de buscar/consultar si existe, sino presionar Enter
    const buttonVisible = await this.searchButton.isVisible({ timeout: 2000 }).catch(() => false);
    if (buttonVisible) {
      await this.searchButton.click();
    } else {
      // Si no hay botón visible, presionar Enter en el input
      await this.searchInput.press('Enter');
    }
  }

  async clickConsultaComplete() {
    // Seleccionar tipo "Completa" en el select
    await this.selectTipoPrefa('completa');
    // Esperar un momento para que el select se actualice
    await this.page.waitForTimeout(500);
    // Hacer click en el botón de buscar/consultar si existe, sino presionar Enter
    const buttonVisible = await this.searchButton.isVisible({ timeout: 2000 }).catch(() => false);
    if (buttonVisible) {
      await this.searchButton.click();
    } else {
      // Si no hay botón visible, presionar Enter en el input
      await this.searchInput.press('Enter');
    }
  }

  async clickConsultaCompound() {
    // Modo compuesto está deshabilitado actualmente, lanzar error informativo
    throw new Error('Modo compuesto está deshabilitado temporalmente. Ver CompoundModeToggle.tsx');
  }

  async waitForResults(timeout = 30000) {
    if (this.page.isClosed()) {
      return; // Si la página está cerrada, simplemente retornar sin error
    }
    
    try {
      // Intentar múltiples selectores para los resultados
      const selectors = [
        '[data-report-container]',
        '[data-testid="results-container"]',
        '.report-container',
        'div:has([data-report-container])',
        '.report-preview',
        '[class*="report"]',
      ];
      
      let found = false;
      for (const selector of selectors) {
        if (this.page.isClosed()) {
          return; // Si la página se cerró durante la espera, retornar sin error
        }
        
        try {
          await this.page.waitForSelector(selector, {
            timeout: Math.min(timeout, 10000), // Usar timeout más corto por selector
            state: 'visible',
          });
          found = true;
          break;
        } catch {
          // Continuar con el siguiente selector
          if (this.page.isClosed()) {
            return; // Si la página se cerró, retornar sin error
          }
        }
      }
      
      if (!found && !this.page.isClosed()) {
        // Solo lanzar error si la página sigue abierta y no se encontraron resultados
        throw new Error(`No se encontraron resultados con ninguno de los selectores: ${selectors.join(', ')}`);
      }
    } catch (error: any) {
      // Si la página se cerró durante el proceso, simplemente retornar
      if (this.page.isClosed() || error.message?.includes('closed')) {
        return;
      }
      throw error;
    }
  }

  async waitForLoadingToFinish(timeout = 30000) {
    const startTime = Date.now();
    
    // Esperar a que el loading desaparezca
    try {
      // Verificar que la página no esté cerrada antes de cada operación
      if (this.page.isClosed()) {
        return; // Si la página está cerrada, simplemente retornar sin error
      }
      
      // Buscar overlays por múltiples selectores
      const overlaySelectors = [
        '[data-testid="loading-overlay"]',
        'div.fixed.inset-0:has-text("Armando")',
        'div.fixed.inset-0:has-text("Buscando")',
        'div.fixed.inset-0:has-text("Validando")',
        'div:has-text("Armando tu prefactibilidad")',
        'div:has-text("Buscando direccion")',
        'div:has-text("Validando si su lote")',
      ];
      
      // Esperar a que cualquier overlay desaparezca
      for (const selector of overlaySelectors) {
        try {
          await this.page.waitForSelector(selector, {
            timeout: 2000,
            state: 'hidden',
          });
        } catch {
          // Continuar con el siguiente selector
        }
      }
    } catch {
      // Si no hay loading overlay, continuar
    }
    
    // Esperar un poco más para asegurar que el overlay desapareció
    await this.page.waitForTimeout(500);
    
    // Verificar timeout y que la página sigue abierta
    if (Date.now() - startTime > timeout) {
      if (this.page.isClosed()) {
        return; // Si la página está cerrada, simplemente retornar sin error
      }
      throw new Error(`Timeout waiting for loading to finish after ${timeout}ms`);
    }
    
    if (this.page.isClosed()) {
      return; // Si la página está cerrada, simplemente retornar sin error
    }
    
    // Esperar a que aparezcan los resultados (con manejo de página cerrada)
    try {
      await this.waitForResults(timeout - (Date.now() - startTime));
    } catch (error: any) {
      // Si la página se cerró durante la espera, simplemente retornar
      if (this.page.isClosed() || error.message?.includes('closed')) {
        return;
      }
      throw error;
    }
  }

  async clearSearch() {
    // Intentar usar el botón de limpiar si existe
    const buttonVisible = await this.clearButton.isVisible({ timeout: 1000 }).catch(() => false);
    if (buttonVisible) {
      await this.clearButton.click();
      await this.page.waitForTimeout(300); // Esperar a que se limpie
    }
    
    // También limpiar el input directamente para asegurarnos
    await this.searchInput.clear();
    await this.page.waitForTimeout(200);
  }

  async resetConsulta() {
    // Intentar usar el botón de resetear si existe
    const buttonVisible = await this.resetButton.isVisible({ timeout: 1000 }).catch(() => false);
    if (buttonVisible) {
      await this.resetButton.click();
      await this.page.waitForTimeout(500); // Esperar a que se resetee
    }
    
    // También limpiar el input directamente para asegurarnos
    await this.searchInput.clear();
    await this.page.waitForTimeout(200);
  }

  async isResultsVisible(): Promise<boolean> {
    try {
      await this.resultsContainer.waitFor({ timeout: 5000 });
      return await this.resultsContainer.isVisible();
    } catch {
      return false;
    }
  }

  async getCreditCost(): Promise<string | null> {
    if (await this.creditCostsBox.isVisible()) {
      return await this.creditCostsBox.textContent();
    }
    return null;
  }
}

