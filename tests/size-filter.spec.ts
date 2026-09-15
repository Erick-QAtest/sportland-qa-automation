import { test, expect, devices } from '@playwright/test';
import { CollectionPage } from '../pages/CollectionPage';

test.use({
  ...devices['Pixel 5']
});

test('user can filter products by size 27', async ({ page, browserName }) => {

  test.skip(
    browserName !== 'chromium',
    'Responsive mobile flow currently validated with Chromium'
  );

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