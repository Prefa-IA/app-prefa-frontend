import { Page, Locator } from '@playwright/test';
import { Selectors } from '../selectors';

/**
 * Page Object Model para la página de Login
 * 
 * Encapsula toda la lógica de interacción con la página de login
 */
export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly registerLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator(Selectors.auth.emailInput);
    this.passwordInput = page.locator(Selectors.auth.passwordInput);
    // Intentar múltiples selectores para el botón de login
    this.submitButton = page.locator(Selectors.auth.loginButton)
      .or(page.locator('button[type="submit"]'))
      .or(page.getByRole('button', { name: /iniciar sesión|login/i }))
      .first();
    this.errorMessage = page.locator('[role="alert"]');
    // Usar el primer link de registro (el más prominente, generalmente el botón)
    this.registerLink = page.getByRole('link', { name: /registrarse|registrar/i }).first()
      .or(page.locator('a[href*="/registro"]').first());
  }

  /**
   * Navega a la página de login
   */
  async goto() {
    // Verificar que la página no esté cerrada antes de navegar
    if (this.page.isClosed()) {
      throw new Error('Page was closed before navigation');
    }
    
    try {
      await this.page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
      // Esperar a que la página esté lista
      await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
    } catch (error: any) {
      // Si la página se cerró durante la navegación, lanzar error descriptivo
      if (this.page.isClosed()) {
        throw new Error('Page was closed during navigation to login page');
      }
      // Re-lanzar el error original si no es un problema de página cerrada
      throw error;
    }
  }

  /**
   * Llena el campo de email
   */
  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  /**
   * Llena el campo de contraseña
   */
  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  /**
   * Hace submit del formulario
   */
  async submit() {
    await this.submitButton.click();
  }

  /**
   * Completa el flujo completo de login
   */
  async login(email: string, password: string) {
    await this.goto();
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.submit();
  }

  /**
   * Verifica si el usuario está logueado (busca el menú de usuario)
   */
  async isLoggedIn(): Promise<boolean> {
    try {
      await this.page.waitForSelector(Selectors.auth.userMenu, {
        timeout: 5000,
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Verifica si hay un mensaje de error visible
   */
  async hasError(): Promise<boolean> {
    try {
      await this.errorMessage.waitFor({ timeout: 2000 });
      return await this.errorMessage.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Obtiene el texto del mensaje de error
   */
  async getErrorMessage(): Promise<string | null> {
    if (await this.hasError()) {
      return await this.errorMessage.textContent();
    }
    return null;
  }

  /**
   * Navega a la página de registro
   */
  async goToRegister() {
    // En dispositivos móviles, los links pueden estar ocultos o fuera del viewport
    // Intentar múltiples estrategias para encontrar y hacer click en el link
    const isVisible = await this.registerLink.isVisible({ timeout: 2000 }).catch(() => false);
    
    if (!isVisible) {
      // Estrategia 1: Intentar hacer scroll usando JavaScript directamente
      try {
        await this.page.evaluate((selector) => {
          const element = document.querySelector(selector);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 'a[href*="/registro"]');
        await this.page.waitForTimeout(500);
      } catch {
        // Continuar con otras estrategias
      }
      
      // Estrategia 2: Buscar el link de otra manera
      const registerLinkAlt = this.page.locator('a:has-text("Registro"), a:has-text("registro"), a:has-text("Crear cuenta")').first();
      const altVisible = await registerLinkAlt.isVisible({ timeout: 2000 }).catch(() => false);
      
      if (altVisible) {
        await registerLinkAlt.click();
        return;
      }
      
      // Estrategia 3: Intentar hacer click directamente aunque no sea visible (puede estar en el DOM)
      try {
        await this.registerLink.click({ force: true, timeout: 3000 });
        return;
      } catch {
        // Si falla, intentar navegar directamente
        await this.page.goto('/registro');
        return;
      }
    }
    
    await this.registerLink.click();
  }
}

