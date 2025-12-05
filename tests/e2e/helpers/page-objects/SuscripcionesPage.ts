import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model para la página de Suscripciones
 */
export class SuscripcionesPage {
  readonly page: Page;
  readonly planCards: Locator;
  readonly selectPlanButton: Locator;
  readonly currentPlan: Locator;
  readonly overageCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.planCards = page.locator('[data-testid="plan-card"], .plan-card');
    this.selectPlanButton = page.locator('[data-testid="select-plan-button"], button:has-text("Seleccionar")');
    this.currentPlan = page.locator('[data-testid="current-plan"], .current-plan');
    this.overageCards = page.locator('[data-testid="overage-card"], .overage-card');
  }

  async goto() {
    if (this.page.isClosed()) {
      throw new Error('Page was closed before navigation');
    }

    try {
      await this.page.goto('/suscripciones', { waitUntil: 'domcontentloaded', timeout: 30000 });
      await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
    } catch (error: any) {
      if (this.page.isClosed()) {
        throw new Error('Page was closed during navigation to suscripciones page');
      }
      throw error;
    }
  }

  async selectPlan(planName: string) {
    const planCard = this.page.locator(`text=${planName}`).locator('..').locator('..');
    await planCard.locator('button:has-text("Seleccionar")').click();
  }

  async getPlanCount(): Promise<number> {
    return await this.planCards.count();
  }

  async hasCurrentPlan(): Promise<boolean> {
    try {
      await this.currentPlan.waitFor({ timeout: 2000 });
      return await this.currentPlan.isVisible();
    } catch {
      return false;
    }
  }
}

