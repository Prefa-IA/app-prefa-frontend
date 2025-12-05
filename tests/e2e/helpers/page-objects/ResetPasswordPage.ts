import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model para la página de Reset de Contraseña
 */
export class ResetPasswordPage {
  readonly page: Page;
  readonly passwordInput: Locator;
  readonly repeatPasswordInput: Locator;
  readonly submitButton: Locator;
  readonly showPasswordButton: Locator;
  readonly showRepeatPasswordButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Usar selectores específicos por ID - estos deben ser únicos en la página
    // Si hay múltiples, usaremos métodos que siempre usen .first()
    this.passwordInput = page.locator('input#password');
    this.repeatPasswordInput = page.locator('input#repeatPassword');
    this.submitButton = page.locator('button[type="submit"]');
    // Buscar botones de mostrar/ocultar contraseña más específicos
    // Buscar el botón que está relacionado con el input específico
    this.showPasswordButton = page.locator('input#password')
      .locator('..')
      .locator('button:has(svg)')
      .first()
      .or(page.locator('button[aria-label*="mostrar"], button[aria-label*="ocultar"]').first());
    this.showRepeatPasswordButton = page.locator('input#repeatPassword')
      .locator('..')
      .locator('button:has(svg)')
      .first()
      .or(page.locator('button[aria-label*="mostrar"], button[aria-label*="ocultar"]').nth(1));
  }

  async goto(token: string) {
    if (this.page.isClosed()) {
      throw new Error('Page was closed before navigation');
    }

    try {
      await this.page.goto(`/reset-password?token=${token}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
    } catch (error: any) {
      if (this.page.isClosed()) {
        throw new Error('Page was closed during navigation to reset-password page');
      }
      throw error;
    }
  }

  async fillPassword(password: string) {
    // Usar el selector específico directamente para evitar múltiples matches
    await this.page.locator('input#password').first().fill(password);
  }

  async fillRepeatPassword(password: string) {
    // Usar el selector específico directamente para evitar múltiples matches
    await this.page.locator('input#repeatPassword').first().fill(password);
  }

  async toggleShowPassword() {
    await this.showPasswordButton.click();
  }

  async toggleShowRepeatPassword() {
    await this.showRepeatPasswordButton.click();
  }

  async submit() {
    await this.submitButton.click();
  }

  async resetPassword(password: string, token: string) {
    await this.goto(token);
    await this.fillPassword(password);
    await this.fillRepeatPassword(password);
    await this.submit();
  }

  async isOnResetPasswordPage(): Promise<boolean> {
    return this.page.url().includes('/reset-password');
  }
}

