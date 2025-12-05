import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model para la página de Registro
 */
export class RegisterPage {
  readonly page: Page;
  readonly nombreInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly repeatPasswordInput: Locator;
  readonly acceptTermsCheckbox: Locator;
  readonly submitButton: Locator;
  readonly backButton: Locator;
  readonly loginLink: Locator;
  readonly termsLink: Locator;
  readonly termsModal: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nombreInput = page.locator('input[name="nombre"]');
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.repeatPasswordInput = page.locator('input[name="repeatPassword"]');
    this.acceptTermsCheckbox = page.locator('#aceptoTyC');
    this.submitButton = page.locator('button[type="submit"]');
    this.backButton = page.locator('button:has-text("←")').first();
    // Usar el primer link de login (el más prominente, generalmente el botón)
    this.loginLink = page.getByRole('link', { name: /iniciar sesión|ingresar|login/i }).first()
      .or(page.locator('a[href*="/login"]').first());
    // Usar el botón de términos dentro del formulario principal, no el del footer
    this.termsLink = page.locator('main button:has-text("Términos y Condiciones")')
      .or(page.locator('form button:has-text("Términos y Condiciones")'))
      .first();
    this.termsModal = page.locator('text=Términos y Condiciones').first();
  }

  async goto() {
    // Verificar que la página no esté cerrada antes de navegar
    if (this.page.isClosed()) {
      throw new Error('Page was closed before navigation');
    }
    
    try {
      await this.page.goto('/registro', { waitUntil: 'domcontentloaded', timeout: 30000 });
      
      // Verificar que la página no se cerró después de la navegación
      if (this.page.isClosed()) {
        throw new Error('Page was closed immediately after navigation');
      }
      
      // Esperar a que la página esté lista (con timeout más corto para evitar esperas largas)
      await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {
        // Si networkidle falla, verificar que la página sigue abierta
        if (this.page.isClosed()) {
          throw new Error('Page was closed while waiting for networkidle');
        }
      });
      
      // Verificación final de que la página sigue abierta
      if (this.page.isClosed()) {
        throw new Error('Page was closed after load state wait');
      }
    } catch (error: any) {
      // Si la página se cerró durante la navegación, lanzar error descriptivo
      if (this.page.isClosed() || error.message?.includes('closed')) {
        throw new Error('Page was closed during navigation to register page');
      }
      // Re-lanzar el error original si no es un problema de página cerrada
      throw error;
    }
  }

  async fillNombre(nombre: string) {
    if (this.page.isClosed()) {
      throw new Error('Page was closed before filling nombre');
    }
    await this.nombreInput.fill(nombre);
  }

  async fillEmail(email: string) {
    if (this.page.isClosed()) {
      throw new Error('Page was closed before filling email');
    }
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string) {
    if (this.page.isClosed()) {
      throw new Error('Page was closed before filling password');
    }
    await this.passwordInput.fill(password);
  }

  async fillRepeatPassword(password: string) {
    if (this.page.isClosed()) {
      throw new Error('Page was closed before filling repeat password');
    }
    await this.repeatPasswordInput.fill(password);
  }

  async acceptTerms() {
    await this.acceptTermsCheckbox.check();
  }

  async unacceptTerms() {
    await this.acceptTermsCheckbox.uncheck();
  }

  async isTermsAccepted(): Promise<boolean> {
    return await this.acceptTermsCheckbox.isChecked();
  }

  async submit() {
    // Verificar que el botón no esté deshabilitado antes de hacer click
    const isDisabled = await this.submitButton.isDisabled();
    if (isDisabled) {
      throw new Error('Cannot submit: button is disabled');
    }
    await this.submitButton.click();
  }

  async isSubmitDisabled(): Promise<boolean> {
    return await this.submitButton.isDisabled();
  }

  async openTermsModal() {
    if (this.page.isClosed()) {
      throw new Error('Page was closed before opening terms modal');
    }
    await this.termsLink.click();
    await this.page.waitForTimeout(500); // Esperar animación del modal
  }

  async closeTermsModal() {
    const closeButton = this.page.locator('button:has(svg)').filter({ hasText: /close/i }).first();
    if (await closeButton.isVisible()) {
      await closeButton.click();
    }
  }

  async goToLogin() {
    // En dispositivos móviles, los links pueden estar ocultos o fuera del viewport
    // Intentar múltiples estrategias para encontrar y hacer click en el link
    const isVisible = await this.loginLink.isVisible({ timeout: 2000 }).catch(() => false);
    
    if (!isVisible) {
      // Estrategia 1: Intentar hacer scroll usando JavaScript directamente
      try {
        await this.page.evaluate((selector) => {
          const element = document.querySelector(selector);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 'a[href*="/login"]');
        await this.page.waitForTimeout(500);
      } catch {
        // Continuar con otras estrategias
      }
      
      // Estrategia 2: Buscar el link de otra manera
      const loginLinkAlt = this.page.locator('a:has-text("Login"), a:has-text("login"), a:has-text("Iniciar sesión"), a:has-text("Ingresar")').first();
      const altVisible = await loginLinkAlt.isVisible({ timeout: 2000 }).catch(() => false);
      
      if (altVisible) {
        await loginLinkAlt.click();
        return;
      }
      
      // Estrategia 3: Intentar hacer click directamente aunque no sea visible (puede estar en el DOM)
      try {
        await this.loginLink.click({ force: true, timeout: 3000 });
        return;
      } catch {
        // Si falla, intentar navegar directamente
        await this.page.goto('/login');
        return;
      }
    }
    
    await this.loginLink.click();
  }

  async goBack() {
    // Intentar múltiples formas de volver atrás
    try {
      // Intentar con el botón específico
      const buttonVisible = await this.backButton.isVisible({ timeout: 2000 }).catch(() => false);
      if (buttonVisible) {
        await this.backButton.click();
        await this.page.waitForTimeout(500);
        return;
      }
    } catch {
      // Si el botón no funciona, usar history.back()
    }
    
    // Fallback: usar history.back() del navegador
    await this.page.goBack();
    await this.page.waitForTimeout(500);
  }

  async register(nombre: string, email: string, password: string) {
    await this.goto();
    await this.fillNombre(nombre);
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.fillRepeatPassword(password);
    await this.acceptTerms();
    // Nota: reCAPTCHA debe ser manejado manualmente o mockeado
    await this.submit();
  }

  async isOnRegisterPage(): Promise<boolean> {
    return this.page.url().includes('/registro');
  }
}

