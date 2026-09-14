import { test, expect } from '@playwright/test';
import { CollectionPage } from '../pages/CollectionPage';

test.use({
  viewport: {
    width: 600,
    height: 900
  }
});

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