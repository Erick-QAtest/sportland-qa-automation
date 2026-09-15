import { test, expect, devices } from '@playwright/test';
import { CollectionPage } from '../pages/CollectionPage';

test.use({
  viewport: devices['Pixel 5'].viewport,
  userAgent: devices['Pixel 5'].userAgent,
  deviceScaleFactor: devices['Pixel 5'].deviceScaleFactor,
  isMobile: true,
  hasTouch: true
});

test.skip(
  ({ browserName }) => browserName !== 'chromium',
  'Responsive mobile flow currently validated with Chromium'
);

test('user can filter products by size 27', async ({ page }) => {

  const collectionPage = new CollectionPage(page);

  await collectionPage.goto();

  await collectionPage.openFilters();

  await collectionPage.showMoreSizes();

  await collectionPage.selectSize(27);

  await expect(
    collectionPage.sizeOption(27)
  ).toBeChecked();

  await expect.poll(() => {
    const url = new URL(page.url());

    return url.searchParams.get(
      'filter.v.option.tamaño'
    );
  }).toBe('27');
});