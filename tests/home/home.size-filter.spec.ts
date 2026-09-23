import {
  test,
  expect,
  devices
} from '@playwright/test';

import {
  HomePage
} from '../../pages/HomePage';

import {
  auditCurrentCollectionSize
} from '../../helpers/catalogSizeAudit';

test.use({
  viewport:
    devices['Pixel 5'].viewport,

  userAgent:
    devices['Pixel 5'].userAgent,

  deviceScaleFactor:
    devices['Pixel 5'].deviceScaleFactor,

  isMobile: true,

  hasTouch: true
});

test.skip(
  ({ browserName }) =>
    browserName !== 'chromium',

  'Responsive mobile flow currently validated with Chromium'
);

test.setTimeout(120_000);

// =======================================
// BUSINESS RULE
// =======================================

const sizeRules = [
  {
    filterSize: 26,
    acceptedSizes: [26, 26.5]
  },
  {
    filterSize: 27,
    acceptedSizes: [27, 27.5]
  }
];

// =======================================
// GENERATE TEST
// =======================================

for (const rule of sizeRules) {
  test(
    `home size ${rule.filterSize} only returns available products with ${rule.acceptedSizes.join(' or ')}`,
    async ({ page }) => {
      const homePage =
        new HomePage(page);

      // =======================================
      // 1. START FROM HOME
      // =======================================

      await homePage.goto();

      await homePage.goToSizeSelector();

      await expect(
        homePage.sizeSelectorTitle
      ).toBeVisible();

      // =======================================
      // 2. SELECT SIZE FROM HOME
      // =======================================

      await homePage.selectSize(
        String(rule.filterSize)
      );

      // =======================================
      // 3. VERIFY DESTINATION
      // =======================================

      await expect(page).toHaveURL(
        /\/collections\/disponible-para-envio-inmediato/
      );

      const url =
        new URL(page.url());

      // Accept locale prefixes such as:
      // /collections/...
      // /en-us/collections/...
      // /es-mx/collections/...
      expect(
        url.pathname
      ).toMatch(
        /^\/(?:[a-z]{2}(?:-[a-z]{2})?\/)?collections\/disponible-para-envio-inmediato$/
      );

      expect(
        url.searchParams.get(
          'filter.v.option.tamaño'
        )
      ).toBe(
        String(rule.filterSize)
      );

      expect(
        url.searchParams.get(
          'filter.v.availability'
        )
      ).toBe('1');

      console.log(
        `Home size ${rule.filterSize} destination:`,
        page.url()
      );

      // =======================================
      // 4. AUDIT CURRENT COLLECTION
      // =======================================

      const result =
        await auditCurrentCollectionSize(
          page,
          rule.filterSize,
          rule.acceptedSizes
        );

      // =======================================
      // REPORT
      // =======================================

      console.log(
        '\n=============================='
      );

      console.log(
        `SIZE ${result.filterSize} AUDIT`
      );

      console.log(
        '=============================='
      );

      console.log(
        'Accepted sizes:',
        result.acceptedSizes
      );

      console.log(
        'Checked:',
        result.checked
      );

      console.log(
        'Valid:',
        result.validProducts.length
      );

      console.log(
        'Invalid:',
        result.invalidProducts.length
      );

      console.log(
        'Technical errors:',
        result.technicalErrors.length
      );

      // =======================================
      // INVALID PRODUCTS
      // =======================================

      if (
        result.invalidProducts.length > 0
      ) {
        console.log(
          '\nInvalid products:'
        );

        result.invalidProducts.forEach(
          (product) => {
            console.log(
              `❌ ${product}`
            );
          }
        );
      }

      // =======================================
      // TECHNICAL ERRORS
      // =======================================

      if (
        result.technicalErrors.length > 0
      ) {
        console.log(
          '\nTechnical errors:'
        );

        result.technicalErrors.forEach(
          (product) => {
            console.log(
              `⚠️ ${product}`
            );
          }
        );
      }

      // =======================================
      // BUILD FAILURE REPORT
      // =======================================

      const problems = [
        ...result.invalidProducts.map(
          (product) =>
            `INVALID SIZE: ${product}`
        ),

        ...result.technicalErrors.map(
          (product) =>
            `TECHNICAL ERROR: ${product}`
        )
      ];

      // =======================================
      // ASSERTION
      // =======================================

      expect(
        problems,
        `Size ${result.filterSize} audit found ${problems.length} problem(s):

${problems.join('\n')}`
      ).toEqual([]);
    }
  );
}