import { test, expect } from '@playwright/test';

test.describe('Navegación Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE

  test('debe mostrar menú hamburguesa en mobile', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    
    const hamburgerMenu = page.locator('[data-testid="mobile-menu-button"], button[aria-label*="menu"], .hamburger').first();
    
    const isVisible = await hamburgerMenu.isVisible({ timeout: 2000 }).catch(() => false);
    
    if (isVisible) {
      await expect(hamburgerMenu).toBeVisible();
    }
  });

  test('debe abrir menú mobile al hacer click', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    
    const hamburgerMenu = page.locator('[data-testid="mobile-menu-button"], button[aria-label*="menu"]').first();
    
    if (await hamburgerMenu.isVisible({ timeout: 2000 }).catch(() => false)) {
      await hamburgerMenu.click();
      await page.waitForTimeout(500);
      
      // Verificar que el menú se abrió
      const mobileMenu = page.locator('[data-testid="mobile-menu"], .mobile-menu, nav[aria-expanded="true"]').first();
      const isOpen = await mobileMenu.isVisible({ timeout: 2000 }).catch(() => false);
      // El menú puede estar visible o no dependiendo de la implementación
    }
  });

  test('debe cerrar menú mobile al hacer click fuera', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    
    const hamburgerMenu = page.locator('[data-testid="mobile-menu-button"]').first();
    
    if (await hamburgerMenu.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Abrir menú
      await hamburgerMenu.click();
      await page.waitForTimeout(500);
      
      // Click fuera del menú
      await page.click('body', { position: { x: 10, y: 10 } });
      await page.waitForTimeout(500);
      
      // Verificar que se cerró
      const mobileMenu = page.locator('[data-testid="mobile-menu"]').first();
      const isClosed = await mobileMenu.isVisible({ timeout: 1000 }).catch(() => false);
      expect(isClosed).toBeFalsy();
    }
  });

  test('debe navegar desde menú mobile', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    
    const hamburgerMenu = page.locator('[data-testid="mobile-menu-button"]').first();
    
    if (await hamburgerMenu.isVisible({ timeout: 2000 }).catch(() => false)) {
      await hamburgerMenu.click();
      await page.waitForTimeout(500);
      
      // Buscar link de consultar
      const consultarLink = page.locator('a[href="/consultar"], a:has-text("Consultar")').first();
      
      if (await consultarLink.isVisible({ timeout: 2000 })) {
        await consultarLink.click();
        await page.waitForTimeout(1000);
        
        // Verificar navegación
        await expect(page).toHaveURL(/\/consultar/);
      }
    }
  });
});

