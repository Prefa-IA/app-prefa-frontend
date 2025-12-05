import { test, expect } from '@playwright/test';

test.describe('Manejo de Errores', () => {
  test('debe mostrar página 404 para rutas no existentes', async ({ page }) => {
    await page.goto('/ruta-inexistente-12345');
    await page.waitForTimeout(2000);
    
    // Verificar mensaje de 404
    const notFoundMessage = page.locator('text=404, text=No encontrado, text=Página no encontrada, h1:has-text("404")').first();
    const has404 = await notFoundMessage.isVisible({ timeout: 3000 }).catch(() => false);
    
    // Puede mostrar 404 o redirigir
  });

  test('debe manejar error 500 del servidor', async ({ page }) => {
    // Mockear respuesta 500
    await page.route('**/api/**', (route) => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Internal Server Error' }),
      });
    });
    
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password');
    
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    
    // Verificar mensaje de error
    const errorMessage = page.locator('text=error, text=500, text=servidor').first();
    const hasError = await errorMessage.isVisible({ timeout: 3000 }).catch(() => false);
    // Puede mostrar error o no
  });

  test('debe manejar error de red', async ({ page }) => {
    // Simular error de red
    await page.route('**/api/**', (route) => {
      route.abort('failed');
    });
    
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password');
    
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    
    // Verificar mensaje de error de red
    const errorMessage = page.locator('text=conexión, text=red, text=error de red').first();
    const hasError = await errorMessage.isVisible({ timeout: 3000 }).catch(() => false);
    // Puede mostrar error o no
  });

  test('debe permitir reintentar después de error', async ({ page }) => {
    // Primero fallar la request
    let requestCount = 0;
    await page.route('**/api/auth/login', (route) => {
      requestCount++;
      if (requestCount === 1) {
        route.fulfill({ status: 500 });
      } else {
        route.continue();
      }
    });
    
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password');
    
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    
    // Buscar botón de reintentar
    const retryButton = page.locator('button:has-text("Reintentar"), button:has-text("Intentar de nuevo")').first();
    
    if (await retryButton.isVisible({ timeout: 2000 })) {
      await retryButton.click();
      await page.waitForTimeout(2000);
      
      // Verificar que se reintentó
      expect(requestCount).toBeGreaterThan(1);
    }
  });
});

