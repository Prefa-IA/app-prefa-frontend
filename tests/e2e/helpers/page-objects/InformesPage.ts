import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model para la página de Informes
 */
export class InformesPage {
  readonly page: Page;
  readonly informeList: Locator;
  readonly searchInput: Locator;
  readonly filterSelect: Locator;
  readonly downloadButton: Locator;
  readonly deleteButton: Locator;
  readonly refreshButton: Locator;
  readonly tabs: Locator;
  readonly informeTab: Locator;
  readonly direccionesTab: Locator;
  readonly paginationNext: Locator;
  readonly paginationPrev: Locator;
  readonly paginationInfo: Locator;
  readonly emptyState: Locator;

  constructor(page: Page) {
    this.page = page;
    // La lista puede ser un <ul> con <li> o puede estar vacía mostrando un estado vacío
    this.informeList = page.locator('ul.divide-y, ul:has(li), [data-testid="informe-list"], .informe-list, div:has-text("No hay informes"), div:has-text("Sin resultados")').first();
    // El input de búsqueda está en SearchSection con placeholder "Buscá por dirección, barrio o SMP"
    this.searchInput = page.locator('input[placeholder*="Buscá"], input[placeholder*="buscar"], input[placeholder*="Buscar"], input[type="search"], input[type="text"]:not([disabled])').first();
    this.filterSelect = page.locator('select').first();
    this.downloadButton = page.locator('[data-testid="download-button"], button:has-text("Descargar")').first();
    this.deleteButton = page.locator('[data-testid="delete-button"], button:has-text("Eliminar")').first();
    this.refreshButton = page.locator('button:has-text("Actualizar"), button:has-text("Refrescar")').first();
    this.tabs = page.locator('[role="tablist"], .tabs').first();
    this.informeTab = page.locator('[role="tab"]:has-text("Informes"), button:has-text("Informes")').first();
    this.direccionesTab = page.locator('[role="tab"]:has-text("Direcciones"), button:has-text("Direcciones")').first();
    this.paginationNext = page.locator('button:has-text("Siguiente"), button[aria-label*="next"]').first();
    this.paginationPrev = page.locator('button:has-text("Anterior"), button[aria-label*="prev"]').first();
    this.paginationInfo = page.locator('.pagination-info, [data-testid="pagination-info"]').first();
    this.emptyState = page.locator('text=No hay informes, text=Sin resultados').first();
  }

  async goto() {
    if (this.page.isClosed()) {
      throw new Error('Page was closed before navigation');
    }

    try {
      await this.page.goto('/informes', { waitUntil: 'domcontentloaded', timeout: 30000 });
      await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
    } catch (error: any) {
      if (this.page.isClosed()) {
        throw new Error('Page was closed during navigation to informes page');
      }
      throw error;
    }
  }

  async searchInformes(query: string) {
    await this.searchInput.fill(query);
    await this.searchInput.press('Enter');
    await this.page.waitForTimeout(1000); // Esperar búsqueda
  }

  async clearSearch() {
    await this.searchInput.clear();
    await this.searchInput.press('Enter');
  }

  async selectFilter(value: string) {
    await this.filterSelect.selectOption(value);
  }

  async downloadInforme(index = 0) {
    const downloadButtons = this.page.locator('[data-testid="download-button"], button:has-text("Descargar")');
    await downloadButtons.nth(index).click();
  }

  async deleteInforme(index = 0) {
    const deleteButtons = this.page.locator('[data-testid="delete-button"], button:has-text("Eliminar")');
    await deleteButtons.nth(index).click();
    // Confirmar eliminación si aparece modal
    const confirmButton = this.page.locator('button:has-text("Confirmar"), button:has-text("Eliminar")').last();
    if (await confirmButton.isVisible({ timeout: 2000 })) {
      await confirmButton.click();
    }
  }

  async refresh() {
    // Verificar si el botón de refresh existe y es visible antes de hacer click
    const isVisible = await this.refreshButton.isVisible({ timeout: 2000 }).catch(() => false);
    if (isVisible) {
      await this.refreshButton.click();
      await this.page.waitForTimeout(1000);
    } else {
      // Si no hay botón de refresh, simplemente recargar la página
      await this.page.reload({ waitUntil: 'domcontentloaded' });
      await this.page.waitForTimeout(1000);
    }
  }

  async switchToInformesTab() {
    await this.informeTab.click();
  }

  async switchToDireccionesTab() {
    await this.direccionesTab.click();
  }

  async goToNextPage() {
    if (await this.paginationNext.isEnabled()) {
      await this.paginationNext.click();
      await this.page.waitForTimeout(1000);
    }
  }

  async goToPrevPage() {
    if (await this.paginationPrev.isEnabled()) {
      await this.paginationPrev.click();
      await this.page.waitForTimeout(1000);
    }
  }

  async getInformeCount(): Promise<number> {
    // La lista de informes usa <ul> con <li> elementos
    const items = this.page.locator('ul.divide-y li, [data-testid="informe-item"], .informe-item, tr[data-informe-id], ul li:has(h3)');
    return await items.count();
  }

  async hasInformes(): Promise<boolean> {
    const count = await this.getInformeCount();
    return count > 0;
  }

  async isOnInformesTab(): Promise<boolean> {
    // Verificar si el tab está activo de múltiples formas
    const ariaSelected = await this.informeTab.getAttribute('aria-selected').catch(() => null);
    if (ariaSelected === 'true') {
      return true;
    }
    
    // Verificar por clase activa
    const hasActiveClass = await this.informeTab.evaluate((el) => {
      return el.classList.contains('active') || 
             el.classList.contains('selected') || 
             el.getAttribute('data-active') === 'true';
    }).catch(() => false);
    
    if (hasActiveClass) {
      return true;
    }
    
    // Verificar si la lista de informes está visible (indicador de que estamos en el tab correcto)
    const listVisible = await this.informeList.isVisible({ timeout: 2000 }).catch(() => false);
    return listVisible;
  }
}

