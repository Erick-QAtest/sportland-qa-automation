import { Page, Locator } from '@playwright/test';

export class CollectionPage {
  readonly page: Page;
  readonly filterButton: Locator;
  readonly filterDrawer: Locator;
  readonly showMoreButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.filterButton = page.getByRole('button', {
      name: /^(Filtro|Filter)$/
    });

    this.filterDrawer = page.locator('#filters-drawer');

    this.showMoreButton = this.filterDrawer.getByRole('button', {
      name: /^(Mostrar más|Show more)$/
    });
  }

  async goto() {
    await this.page.goto(
      'https://sportlandmx.com/collections/hombre'
    );
  }

  async openFilters() {
    await this.filterButton.click();
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
      { exact: true }
    );
  }

  async selectSize(size: number) {
    await this.sizeLabel(size).click();
  }
}