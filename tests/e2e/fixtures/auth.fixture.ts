import { test as base, Page } from '@playwright/test';
import { Selectors } from '../helpers/selectors';

/**
 * Datos de prueba para autenticación
 */
export const testUsers = {
  regular: {
    email: 'test@example.com',
    password: 'Test123!',
  },
  admin: {
    email: 'admin@example.com',
    password: 'Admin123!',
  },
} as const;

/**
 * Fixture que proporciona una página autenticada
 */
export const test = base.extend<{
  authenticatedPage: Page;
}>({
  authenticatedPage: async ({ page }, use, testInfo) => {
    testInfo.setTimeout(60000);

    // Función auxiliar para realizar login con retry
    const performLoginWithRetry = async (maxRetries = 5): Promise<void> => {
      let lastError: Error | null = null;
      
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        // Verificar que la página no esté cerrada antes de comenzar
        if (page.isClosed()) {
          throw new Error('Page was closed before login could start');
        }

        // Si no es el primer intento, esperar con backoff exponencial
        if (attempt > 0) {
          const backoffDelay = Math.min(1000 * Math.pow(2, attempt - 1), 15000); // Máximo 15 segundos
          
          // Verificar que la página no esté cerrada antes de esperar
          if (page.isClosed()) {
            throw new Error('Page was closed before backoff delay');
          }
          
          // Esperar en pequeños incrementos para poder detectar si la página se cierra
          const incrementMs = 500;
          let remainingDelay = backoffDelay;
          
          while (remainingDelay > 0 && !page.isClosed()) {
            const currentDelay = Math.min(incrementMs, remainingDelay);
            try {
              await page.waitForTimeout(currentDelay);
            } catch (timeoutError: any) {
              // Si la página se cerró durante el timeout, simplemente continuar con el siguiente intento
              if (page.isClosed()) {
                // No lanzar error aquí, simplemente salir del loop y continuar con el siguiente intento
                break;
              }
              // Si es otro error, re-lanzarlo
              throw timeoutError;
            }
            remainingDelay -= currentDelay;
          }
          
          // Si la página se cerró durante el backoff, simplemente continuar con el siguiente intento
          if (page.isClosed()) {
            // No lanzar error, simplemente continuar con el siguiente intento
            continue;
          }
        }

        // Navegar a login primero
        try {
          await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
        } catch (error: any) {
          if (page.isClosed()) {
            throw new Error('Page was closed during navigation to login page');
          }
          if (attempt === maxRetries - 1) {
            throw error;
          }
          lastError = error;
          continue;
        }
        
        // Esperar a que el formulario esté listo
        try {
          await page.waitForSelector(Selectors.auth.emailInput, { timeout: 10000 });
        } catch (error: any) {
          if (attempt === maxRetries - 1) {
            throw error;
          }
          lastError = error;
          continue;
        }

        // Limpiar localStorage después de que la página esté cargada
        try {
          await page.evaluate(() => {
            localStorage.clear();
            sessionStorage.clear();
          });
        } catch {
          // Ignorar errores de seguridad si localStorage no está disponible
        }

        // Llenar formulario de login
        await page.fill(Selectors.auth.emailInput, testUsers.regular.email);
        await page.fill(Selectors.auth.passwordInput, testUsers.regular.password);

        // Configurar listener para capturar respuestas del login
        interface LoginResponseData {
          status: number;
          url: string;
          body: any;
        }
        let loginResponseData: LoginResponseData | null = null;
        const responseListener = (response: any) => {
          const url = response.url();
          if (url.includes('/auth/login') || url.includes('/api/auth/login')) {
            response.json().then((body: any) => {
              loginResponseData = {
                status: response.status(),
                url: url,
                body: body,
              };
            }).catch(() => {
              loginResponseData = {
                status: response.status(),
                url: url,
                body: null,
              };
            });
          }
        };
        page.on('response', responseListener);

        // Esperar respuesta del login ANTES de hacer click
        // Buscar cualquier URL que contenga '/auth/login' o '/api/auth/login'
        const loginResponsePromise = page.waitForResponse(
          (response) => {
            const url = response.url();
            const isLoginUrl = url.includes('/auth/login') || url.includes('/api/auth/login');
            return isLoginUrl;
          },
          { timeout: 30000 }
        ).catch(() => null);

        // Hacer click en el botón de login
        const loginButton = page.locator(Selectors.auth.loginButton)
          .or(page.locator('button[type="submit"]'))
          .or(page.getByRole('button', { name: /iniciar sesión|login/i }))
          .first();
        
        // Asegurarse de que el botón esté visible antes de hacer click
        try {
          await loginButton.waitFor({ state: 'visible', timeout: 5000 });
          await loginButton.click();
        } catch (error: any) {
          page.off('response', responseListener);
          if (attempt === maxRetries - 1) {
            throw error;
          }
          lastError = error;
          continue;
        }

        // Esperar respuesta del login
        const response = await loginResponsePromise;
        
        // Remover el listener después de obtener la respuesta
        page.off('response', responseListener);

        // Verificar la respuesta del login primero
        if (response) {
          const status = response.status();
          
          // Si es un error 429 (Too Many Requests), reintentar
          if (status === 429) {
            if (attempt < maxRetries - 1) {
              lastError = new Error(`Login failed: Rate limit exceeded (429). Retry attempt ${attempt + 1}/${maxRetries}`);
              continue;
            } else {
              throw new Error(`Login failed: Rate limit exceeded (429) after ${maxRetries} attempts. Consider reducing test parallelism or increasing rate limit.`);
            }
          }
          
          if (status !== 200 && status !== 201) {
            // Si la respuesta fue un error, obtener el mensaje
            let errorMessage = `Login API returned status ${status}`;
            try {
              const body = await response.json().catch(() => null);
              if (body && typeof body === 'object' && 'error' in body) {
                errorMessage = String(body.error);
              }
            } catch {
              // Ignorar errores al parsear JSON
            }
            
            // Solo reintentar si es un error transitorio (5xx) y no es el último intento
            if (status >= 500 && status < 600 && attempt < maxRetries - 1) {
              lastError = new Error(`Login failed: ${errorMessage}`);
              continue;
            }
            
            throw new Error(`Login failed: ${errorMessage}`);
          }
        }
        
        // Verificar también los datos capturados del listener
        if (!response && loginResponseData) {
          const responseData: LoginResponseData = loginResponseData;
          
          // Si es un error 429, reintentar
          if (responseData.status === 429) {
            if (attempt < maxRetries - 1) {
              lastError = new Error(`Login failed: Rate limit exceeded (429). Retry attempt ${attempt + 1}/${maxRetries}`);
              continue;
            } else {
              throw new Error(`Login failed: Rate limit exceeded (429) after ${maxRetries} attempts. Consider reducing test parallelism or increasing rate limit.`);
            }
          }
          
          if (responseData.status !== 200 && responseData.status !== 201) {
            // Si tenemos datos de respuesta pero no fue exitosa
            const errorMsg = (responseData.body && typeof responseData.body === 'object' && 'error' in responseData.body)
              ? String(responseData.body.error)
              : `Status ${responseData.status}`;
            
            // Solo reintentar si es un error transitorio (5xx) y no es el último intento
            if (responseData.status >= 500 && responseData.status < 600 && attempt < maxRetries - 1) {
              lastError = new Error(`Login failed: ${errorMsg}`);
              continue;
            }
            
            throw new Error(`Login failed: ${errorMsg}`);
          }
        }
        
        // Si llegamos aquí, el login fue exitoso
        return;
      }
      
      // Si llegamos aquí después de todos los intentos, lanzar el último error
      if (lastError) {
        throw lastError;
      }
      throw new Error('Login failed: Unknown error after retries');
    };

    // Realizar login con retry
    await performLoginWithRetry();

    // Esperar a que el token se guarde en localStorage o que navegue
    // Intentar múltiples estrategias para detectar login exitoso
    let loginSuccess = false;
    const maxWaitTime = 20000; // 20 segundos máximo (reducido porque ya esperamos la respuesta)
    const startTime = Date.now();

    while (!loginSuccess && Date.now() - startTime < maxWaitTime) {
      // Verificar que la página no esté cerrada antes de continuar
      if (page.isClosed()) {
        throw new Error('Page was closed during login process');
      }

      try {
        // Verificar token
        const token = await page.evaluate(() => localStorage.getItem('token')).catch(() => null);
        if (token && token.length > 0) {
          loginSuccess = true;
          break;
        }

        // Verificar si navegó (indicador de login exitoso)
        const currentUrl = page.url();
        if (!currentUrl.includes('/login') && currentUrl !== 'about:blank') {
          // Si navegó fuera de login, probablemente el login fue exitoso
          // Verificar token una vez más
          const tokenAfterNav = await page.evaluate(() => localStorage.getItem('token')).catch(() => null);
          if (tokenAfterNav && tokenAfterNav.length > 0) {
            loginSuccess = true;
            break;
          }
        }

        // Esperar un poco antes de verificar de nuevo
        // Verificar que la página no esté cerrada antes de esperar
        if (!page.isClosed()) {
          await page.waitForTimeout(500);
        } else {
          throw new Error('Page was closed during login wait loop');
        }
      } catch (waitError: any) {
        // Si la página se cerró durante la espera, lanzar error
        if (page.isClosed() || waitError.message?.includes('closed')) {
          throw new Error('Page was closed during login verification loop');
        }
        // Si es otro error, continuar el loop
        await page.waitForTimeout(500).catch(() => {});
      }
    }

    // Si aún no hay éxito, verificar errores
    if (!loginSuccess) {
      if (page.isClosed()) {
        throw new Error('Page was closed during login process');
      }

      // Esperar un poco más para que aparezcan errores
      await page.waitForTimeout(2000).catch(() => {});

      // Buscar errores en toasts
      const toastError = page.locator('.Toastify__toast--error, [class*="toast-error"], [role="alert"]').first();
      const hasToastError = await toastError.isVisible({ timeout: 3000 }).catch(() => false);
      
      if (hasToastError) {
        const errorText = await toastError.textContent().catch(() => 'Unknown error');
        throw new Error(`Login failed: ${errorText}`);
      }

      // Verificar mensajes de error en la página
      const pageError = await page.locator('[role="alert"], .error, [class*="error"]').first().textContent().catch(() => null);
      
      if (pageError) {
        throw new Error(`Login failed: ${pageError}`);
      }

      // Verificar token una última vez
      const finalTokenCheck = await page.evaluate(() => localStorage.getItem('token')).catch(() => null);
      if (!finalTokenCheck) {
        // Obtener más información para debugging
        const url = page.url();
        const pageTitle = await page.title().catch(() => 'Unknown');

        throw new Error(
          `Login failed: No token found after ${maxWaitTime}ms. ` +
          `Still on: ${url}, Page title: ${pageTitle}. ` +
          `Check credentials (${testUsers.regular.email}) and API connection. ` +
          `Make sure the auth-ms service is running and the test user exists in the database. ` +
          `Run: docker compose exec auth-ms node scripts/playwright-seeds.cjs`
        );
      }
    }

    // Verificar token final antes de continuar
    const finalToken = await page.evaluate(() => localStorage.getItem('token')).catch(() => null);
    if (!finalToken) {
      throw new Error('Login failed: Token not found after login process');
    }

    // Esperar navegación a /consultar (el código navega después de guardar el token)
    // Pero ser más tolerante - si ya estamos en una página válida, continuar
    const currentUrl = page.url();
    const isOnLoginPage = currentUrl.includes('/login');
    const isOnValidPage = currentUrl.includes('/consultar') || 
                          currentUrl.includes('/informes') || 
                          currentUrl.includes('/perfil') ||
                          currentUrl.includes('/suscripciones') ||
                          (!isOnLoginPage && currentUrl !== 'about:blank');

    if (!isOnValidPage) {
      try {
        // Esperar navegación automática
        await page.waitForURL(/\/consultar|\/informes|\/perfil|\/suscripciones/, { timeout: 15000 });
      } catch {
        // Si no navegó automáticamente y estamos en login, navegar manualmente
        if (isOnLoginPage) {
          // Verificar que tenemos token antes de navegar manualmente
          const tokenCheck = await page.evaluate(() => localStorage.getItem('token')).catch(() => null);
          if (tokenCheck) {
            try {
              // Intentar navegar manualmente a /consultar
              await page.goto('/consultar', { waitUntil: 'domcontentloaded', timeout: 15000 });
              await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
            } catch (navError: any) {
              // Si la navegación falla, verificar si es porque la página se cerró
              if (page.isClosed()) {
                throw new Error('Page was closed during navigation to /consultar');
              }
              // Si hay un error de redirección (por ejemplo, vuelve a login), puede ser un problema de autenticación
              const finalUrl = page.url();
              if (finalUrl.includes('/login')) {
                throw new Error('Login failed: Redirected back to login page. Token may be invalid.');
              }
              // Si es otro error, lanzarlo
              throw navError;
            }
          } else {
            throw new Error('Login failed: No token found and could not navigate to /consultar');
          }
        }
      }
    }

    // Usar la página autenticada
    await use(page);

    // Cleanup: limpiar localStorage después del test
    try {
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
    } catch {
      // Ignorar errores de cleanup si la página ya está cerrada
    }
  },
});

export { expect } from '@playwright/test';

