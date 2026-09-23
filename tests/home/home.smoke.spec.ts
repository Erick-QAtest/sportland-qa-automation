import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';

test.describe('Sportland MX - Home Smoke Tests', () => {

  test(
    'HOME-SMOKE-001 | Home loads core shopping elements',
    async ({ page }) => {

      const homePage = new HomePage(page);

      await homePage.goto();

      await expect(homePage.heroTitle).toBeVisible();

      await expect(homePage.heroCTA).toBeVisible();

      await expect(homePage.sizeSelectorTitle).toBeVisible();
    }
  );

});