import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model para la página de Perfil de Usuario
 */
export class PerfilPage {
  readonly page: Page;
  readonly nombreInput: Locator;
  readonly emailInput: Locator;
  readonly saveButton: Locator;
  readonly creditsDisplay: Locator;
  readonly planDisplay: Locator;
  readonly changePasswordButton: Locator;
  readonly currentPasswordInput: Locator;
  readonly newPasswordInput: Locator;
  readonly confirmPasswordInput: Locator;

  constructor(page: Page) {
    this.page = page;
    // Usar selectores más robustos que incluyan más variantes posibles
    // Incluir nombreCompleto que es usado en facturación
    this.nombreInput = page.locator('input[name="nombre"], input[name="nombreCompleto"], input[placeholder*="nombre"], input[placeholder*="Nombre"]').first();
    this.emailInput = page.locator('input[name="email"], input[type="email"], input[placeholder*="email"], input[placeholder*="Email"]').first();
    this.saveButton = page.locator('button:has-text("Guardar"), button:has-text("guardar"), button[type="submit"]').first();
    this.creditsDisplay = page.locator('[data-testid="credits-display"], .credits, .credit-balance, [class*="credit"]').first();
    this.planDisplay = page.locator('[data-testid="plan-display"], .plan-name, [class*="plan"]').first();
    this.changePasswordButton = page.locator('button:has-text("Cambiar contraseña"), button:has-text("cambiar contraseña")').first();
    this.currentPasswordInput = page.locator('input[name="currentPassword"], input[name="password"][type="password"]').first();
    this.newPasswordInput = page.locator('input[name="newPassword"], input[name="new-password"]').first();
    this.confirmPasswordInput = page.locator('input[name="confirmPassword"], input[name="confirm-password"]').first();
  }

  async goto() {
    if (this.page.isClosed()) {
      throw new Error('Page was closed before navigation');
    }

    try {
      await this.page.goto('/perfil', { waitUntil: 'domcontentloaded', timeout: 30000 });
      await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
    } catch (error: any) {
      if (this.page.isClosed()) {
        throw new Error('Page was closed during navigation to perfil page');
      }
      throw error;
    }
  }

  async fillNombre(nombre: string) {
    await this.nombreInput.fill(nombre);
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async save() {
    await this.saveButton.click();
  }

  async getCredits(): Promise<string | null> {
    if (await this.creditsDisplay.isVisible()) {
      return await this.creditsDisplay.textContent();
    }
    return null;
  }

  async getPlan(): Promise<string | null> {
    if (await this.planDisplay.isVisible()) {
      return await this.planDisplay.textContent();
    }
    return null;
  }

  async changePassword(currentPassword: string, newPassword: string) {
    await this.changePasswordButton.click();
    await this.currentPasswordInput.fill(currentPassword);
    await this.newPasswordInput.fill(newPassword);
    await this.confirmPasswordInput.fill(newPassword);
    await this.saveButton.click();
  }
}

