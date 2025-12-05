import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model para la página de Recuperación de Contraseña
 */
export class ForgotPasswordPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly submitButton: Locator;
  readonly backButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input[type="email"]');
    this.submitButton = page.locator('button[type="submit"]');
    // Buscar botón de volver más específico
    this.backButton = page.locator('button:has-text("←")')
      .or(page.getByRole('button', { name: /volver|back/i }))
      .or(page.locator('a[href*="/login"]'))
      .first();
  }

  async goto() {
    // Verificar que la página no esté cerrada antes de navegar
    if (this.page.isClosed()) {
      throw new Error('Page was closed before navigation');
    }
    
    try {
      await this.page.goto('/forgot-password', { waitUntil: 'domcontentloaded', timeout: 30000 });
      // Esperar a que la página esté lista
      await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
    } catch (error: any) {
      // Si la página se cerró durante la navegación, lanzar error descriptivo
      if (this.page.isClosed()) {
        throw new Error('Page was closed during navigation to forgot-password page');
      }
      // Re-lanzar el error original si no es un problema de página cerrada
      throw error;
    }
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async submit() {
    await this.submitButton.click();
  }

  async goBack() {
    // Intentar hacer clic en el botón de volver, si no funciona, navegar directamente
    try {
      await this.backButton.click({ timeout: 2000 });
      // Esperar un momento para que la navegación ocurra
      await this.page.waitForTimeout(500);
    } catch {
      // Si el botón no funciona, navegar directamente a login
      await this.page.goto('/login');
    }
  }

  async requestPasswordReset(email: string) {
    await this.goto();
    await this.fillEmail(email);
    await this.submit();
  }

  async isOnForgotPasswordPage(): Promise<boolean> {
    return this.page.url().includes('/forgot-password');
  }
}

