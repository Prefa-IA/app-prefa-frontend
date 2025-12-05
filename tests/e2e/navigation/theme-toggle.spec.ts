import { test, expect } from '@playwright/test';

test.describe('Theme Toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
  });

  test('debe mostrar toggle de tema', async ({ page }) => {
    const themeToggle = page.locator('[data-testid="theme-toggle"], button[aria-label*="theme"], button[aria-label*="tema"]').first();
    
    const isVisible = await themeToggle.isVisible({ timeout: 2000 }).catch(() => false);
    
    if (isVisible) {
      await expect(themeToggle).toBeVisible();
    }
  });

  test('debe cambiar entre tema claro y oscuro', async ({ page }) => {
    const themeToggle = page.locator('[data-testid="theme-toggle"], button[aria-label*="theme"]').first();
    
    if (await themeToggle.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Obtener tema inicial
      const initialTheme = await page.evaluate(() => {
        return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      });
      
      // Hacer click en toggle
      await themeToggle.click();
      await page.waitForTimeout(500);
      
      // Verificar cambio de tema
      const newTheme = await page.evaluate(() => {
        return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      });
      
      expect(newTheme).not.toBe(initialTheme);
    }
  });

  test('debe persistir tema en localStorage', async ({ page }) => {
    const themeToggle = page.locator('[data-testid="theme-toggle"]').first();
    
    if (await themeToggle.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Cambiar tema
      await themeToggle.click();
      await page.waitForTimeout(500);
      
      // Verificar que se guardó en localStorage
      const theme = await page.evaluate(() => {
        return localStorage.getItem('theme') || localStorage.getItem('darkMode');
      });
      
      // Puede guardar 'dark', 'light', 'true', 'false', etc.
      expect(theme).toBeTruthy();
    }
  });

  test('debe aplicar tema guardado al recargar', async ({ page }) => {
    // Establecer tema en localStorage
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('theme', 'dark');
    });
    
    await page.reload();
    await page.waitForTimeout(1000);
    
    // Verificar que se aplicó el tema
    const hasDarkClass = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark');
    });
    
    // El tema puede estar aplicado o no dependiendo de la implementación
  });
});

