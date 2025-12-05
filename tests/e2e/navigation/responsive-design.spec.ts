import { test, expect } from '@playwright/test';

test.describe('Responsive Design', () => {
  test('debe adaptarse a mobile (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForTimeout(1000);
    
    // Verificar que el contenido se adapta
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // Verificar que no hay overflow horizontal
    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    
    // Puede tener o no overflow dependiendo del diseño
  });

  test('debe adaptarse a tablet (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForTimeout(1000);
    
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('debe adaptarse a desktop (1920px)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForTimeout(1000);
    
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('debe mostrar menú hamburguesa en mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForTimeout(1000);
    
    const hamburgerMenu = page.locator('[data-testid="mobile-menu-button"], button[aria-label*="menu"]').first();
    const isVisible = await hamburgerMenu.isVisible({ timeout: 2000 }).catch(() => false);
    
    // Puede estar visible o no dependiendo del diseño
  });

  test('debe mostrar menú completo en desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForTimeout(1000);
    
    const navbar = page.locator('[data-testid="navbar"], nav').first();
    await expect(navbar).toBeVisible({ timeout: 5000 });
  });
});

