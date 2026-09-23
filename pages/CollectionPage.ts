import { Page, Locator } from '@playwright/test';

export class CollectionPage {

  readonly page: Page;

  readonly filterButton: Locator;

  readonly filterDrawer: Locator;

  readonly showMoreButton: Locator;

  readonly clearFiltersButton: Locator;

  readonly productGrid: Locator;

  constructor(page: Page) {

    this.page = page;

    this.filterButton = page.getByRole('button', {
      name: /^(Filtro|Filter)$/
    });

    this.filterDrawer = page.locator('#filters-drawer');

    this.showMoreButton = this.filterDrawer.getByRole('button', {
      name: /^(Mostrar más|Show more)$/
    });

    this.clearFiltersButton = this.filterDrawer.getByRole('button', {
      name: /^(Borrar|Clear)$/i
    });

    this.productGrid = page.getByTestId('product-grid');
  }

  async goto() {

    await this.page.goto(
      'https://sportlandmx.com/collections/hombre'
    );
  }

  async openFilters() {

    await this.filterButton.click();
  }

  async clearFilters() {

    const clearButtonExists =
      await this.clearFiltersButton.count();

    if (
      clearButtonExists > 0 &&
      await this.clearFiltersButton.isVisible()
    ) {

      await this.clearFiltersButton.click();
    }
  }

  async showMoreSizes() {

    await this.showMoreButton.click();
  }

  sizeOption(size: number): Locator {

    return this.filterDrawer.getByRole('checkbox', {
      name: String(size),
      exact: true
    });
  }

  sizeLabel(size: number): Locator {

    return this.filterDrawer.getByText(
      String(size),
      {
        exact: true
      }
    );
  }

  async selectSize(size: number) {

    await this.sizeLabel(size).click();
  }

  productLinks(): Locator {

    return this.productGrid.locator(
      'a[href*="/products/"]'
    );
  }
}