import { defineConfig, devices } from '@playwright/test';

export default defineConfig({

  // Carpeta donde vivirán todos nuestros tests
  testDir: './tests',

  // Permite ejecutar archivos de prueba en paralelo
  fullyParallel: true,

  // Evita que accidentalmente dejemos test.only en CI
  forbidOnly: !!process.env.CI,

  // Reintentos únicamente cuando corra en CI
  retries: process.env.CI ? 2 : 0,

  // En CI usamos un solo worker para mayor estabilidad
  workers: process.env.CI ? 1 : undefined,

  // Reportes
  reporter: [
    ['list'],
    ['html', {
      outputFolder: 'playwright-report',
      open: 'never',
    }],
  ],

  // Configuración compartida por todos los navegadores
  use: {

    // URL principal de Sportland
    baseURL: 'https://sportlandmx.com',

    // Guarda trace cuando un test falla
    trace: 'retain-on-failure',

    // Screenshot automático únicamente cuando falla
    screenshot: 'only-on-failure',

    // Video únicamente cuando falla
    video: 'retain-on-failure',

    // Tiempo máximo para acciones individuales
    actionTimeout: 10_000,

    // Tiempo máximo para navegación
    navigationTimeout: 30_000,
  },

  // Tiempo máximo de cada test completo
  timeout: 30_000,

  // Tiempo máximo para expect()
  expect: {
    timeout: 5_000,
  },

  // Ambientes / dispositivos que queremos cubrir
  projects: [

    // =====================================================
    // DESKTOP
    // =====================================================

    {
      name: 'desktop-chromium',

      use: {
        ...devices['Desktop Chrome'],

        viewport: {
          width: 1440,
          height: 900,
        },
      },
    },


    // =====================================================
    // MOBILE — CHROME / ANDROID
    // =====================================================

    {
      name: 'mobile-chrome',

      use: {
        ...devices['Pixel 7'],
      },
    },


    // =====================================================
    // MOBILE — SAFARI / iOS
    // =====================================================

    {
      name: 'mobile-safari',

      use: {
        ...devices['iPhone 13'],
      },
    },

  ],

  // Evidencia generada por ejecuciones
  outputDir: 'test-results',

});