import { Page } from '@playwright/test';

import { CollectionPage } from '../pages/CollectionPage';

import {
  ProductPage,
  SizeStatus
} from '../pages/ProductPage';

export type SizeAuditResult = {
  filterSize: number;
  acceptedSizes: number[];
  checked: number;
  validProducts: string[];
  invalidProducts: string[];
  technicalErrors: string[];
};

export async function auditCurrentCollectionSize(
  page: Page,
  filterSize: number,
  acceptedSizes: number[]
): Promise<SizeAuditResult> {
  const collectionPage =
    new CollectionPage(page);

  // ==============================
  // 1. VERIFY CURRENT COLLECTION
  // ==============================

  const collectionUrl =
    page.url();

  const currentUrl =
    new URL(collectionUrl);

  const activeSizeFilters =
    currentUrl.searchParams.getAll(
      'filter.v.option.tamaño'
    );

  console.log(
    'Current collection URL:',
    collectionUrl
  );

  console.log(
    'Active size filters:',
    activeSizeFilters
  );

  if (
    !activeSizeFilters.includes(
      String(filterSize)
    )
  ) {
    throw new Error(
      `Audit expected size ${filterSize} to be active, but found: ${activeSizeFilters.join(', ')}`
    );
  }

  // ==============================
  // 2. WAIT FOR PRODUCT GRID
  // ==============================

  const productLinks =
    collectionPage.productLinks();

  await productLinks
    .first()
    .waitFor({
      state: 'attached',
      timeout: 15_000
    });

  const productLinkCount =
    await productLinks.count();

  console.log(
    'Product links found in current collection:',
    productLinkCount
  );

  // ==============================
  // 3. GET UNIQUE PRODUCTS
  // ==============================

  const hrefs =
    await productLinks.evaluateAll(
      (links) =>
        links
          .map((link) =>
            link.getAttribute('href')
          )
          .filter(
            (href): href is string =>
              Boolean(href)
          )
    );

  const productPaths =
    hrefs.map(
      (href) =>
        new URL(
          href,
          collectionUrl
        ).pathname
    );

  const uniqueProductPaths = [
    ...new Set(productPaths)
  ];

  if (
    uniqueProductPaths.length === 0
  ) {
    throw new Error(
      `No products found for size ${filterSize}`
    );
  }

  console.log(
    `Unique products found for size ${filterSize}:`,
    uniqueProductPaths.length
  );

  // ==============================
  // 4. RESULT ARRAYS
  // ==============================

  const validProducts: string[] = [];
  const invalidProducts: string[] = [];
  const technicalErrors: string[] = [];

  // ==============================
  // 5. AUDIT PRODUCT PAGES
  // ==============================

  for (
    const productPath
    of uniqueProductPaths
  ) {
    try {
      const productUrl =
        new URL(
          productPath,
          collectionUrl
        ).toString();

      await page.goto(
        productUrl,
        {
          waitUntil:
            'domcontentloaded'
        }
      );

      const productPage =
        new ProductPage(page);

      const statuses =
        await Promise.all(
          acceptedSizes.map(
            (size) =>
              productPage.getSizeStatus(
                size
              )
          )
        );

      const productIsValid =
        statuses.some(
          (status) =>
            status === 'AVAILABLE'
        );

      const statusReport =
        acceptedSizes.reduce(
          (
            report,
            size,
            index
          ) => {
            report[size] =
              statuses[index];

            return report;
          },

          {} as Record<
            number,
            SizeStatus
          >
        );

      console.log(
        productPath,
        statusReport,
        productIsValid
          ? 'PASS'
          : 'FAIL'
      );

      if (productIsValid) {
        validProducts.push(
          productPath
        );
      } else {
        invalidProducts.push(
          productPath
        );
      }

    } catch (error) {
      console.log(
        'TECHNICAL ERROR:',
        productPath
      );

      if (
        error instanceof Error
      ) {
        console.log(
          'REASON:',
          error.message
        );
      } else {
        console.log(
          'REASON:',
          error
        );
      }

      technicalErrors.push(
        productPath
      );
    }
  }

  // ==============================
  // 6. RETURN AUDIT REPORT
  // ==============================

  return {
    filterSize,
    acceptedSizes,
    checked:
      uniqueProductPaths.length,
    validProducts,
    invalidProducts,
    technicalErrors
  };
}