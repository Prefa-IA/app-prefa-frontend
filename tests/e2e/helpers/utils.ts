import { Page, expect } from '@playwright/test';

/**
 * Utilidades compartidas para tests E2E
 */

/**
 * Espera a que un elemento esté visible y luego lo retorna
 */
export async function waitForVisible(
  page: Page,
  selector: string,
  timeout = 10000
) {
  const element = page.locator(selector);
  await expect(element).toBeVisible({ timeout });
  return element;
}

/**
 * Espera a que un elemento desaparezca
 */
export async function waitForHidden(
  page: Page,
  selector: string,
  timeout = 10000
) {
  const element = page.locator(selector);
  await expect(element).toBeHidden({ timeout });
}

/**
 * Espera a que una respuesta de API se complete
 */
export async function waitForApiResponse(
  page: Page,
  urlPattern: string | RegExp,
  timeout = 30000
) {
  try {
    return await page.waitForResponse(
      (response) => {
        const url = response.url();
        if (typeof urlPattern === 'string') {
          return url.includes(urlPattern);
        }
        return urlPattern.test(url);
      },
      { timeout }
    );
  } catch (error) {
    // Si la página se cerró o hubo un timeout, retornar null en lugar de fallar
    if (page.isClosed()) {
      return null;
    }
    throw error;
  }
}

/**
 * Limpia el localStorage y sessionStorage
 */
export async function clearStorage(page: Page) {
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

/**
 * Espera a que la página termine de cargar completamente
 */
export async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.waitForLoadState('domcontentloaded');
}

/**
 * Toma un screenshot con nombre descriptivo
 */
export async function takeScreenshot(
  page: Page,
  name: string,
  fullPage = false
) {
  await page.screenshot({
    path: `test-results/screenshots/${name}.png`,
    fullPage,
  });
}

/**
 * Verifica que no haya errores en la consola
 */
export async function checkConsoleErrors(page: Page) {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  return errors;
}

/**
 * Espera a que un toast aparezca con un mensaje específico
 */
export async function waitForToast(
  page: Page,
  message: string,
  timeout = 5000
) {
  await expect(
    page.locator(`[data-testid="toast"]:has-text("${message}")`)
  ).toBeVisible({ timeout });
}

/**
 * Hace scroll hasta un elemento
 */
export async function scrollToElement(page: Page, selector: string) {
  await page.locator(selector).scrollIntoViewIfNeeded();
}

/**
 * Espera a que un elemento tenga un texto específico
 */
export async function waitForText(
  page: Page,
  selector: string,
  text: string,
  timeout = 10000
) {
  await expect(page.locator(selector)).toContainText(text, { timeout });
}

/**
 * Espera de forma segura, verificando que la página no esté cerrada
 */
export async function safeWaitForTimeout(page: Page, timeout: number) {
  if (page.isClosed()) {
    return;
  }
  try {
    await page.waitForTimeout(timeout);
  } catch (error: any) {
    // Si la página se cerró durante la espera, ignorar el error
    if (page.isClosed() || error.message?.includes('closed')) {
      return;
    }
    throw error;
  }
}

