import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';

test.describe('Sportland MX - Home Navigation', () => {

  test(
    'HOME-FUNC-001 | Hero CTA navigates to size selector',
    async ({ page }) => {

      const homePage = new HomePage(page);

      await homePage.goto();

      await expect(homePage.heroCTA).toBeVisible();

      await homePage.goToSizeSelector();

      await expect(homePage.sizeSelectorTitle).toBeVisible();

      await expect(page).toHaveURL(/#encuentra-tu-talla/);
    }
  );

});