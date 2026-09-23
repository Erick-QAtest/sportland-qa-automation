import { Page, Locator } from '@playwright/test';

export class HomePage {

  readonly page: Page;

  readonly heroTitle: Locator;

  readonly heroCTA: Locator;

  readonly sizeSelectorTitle: Locator;

  constructor(page: Page) {

    this.page = page;

    this.heroTitle = page.getByText(
      'Tenis originales.',
      { exact: true }
    );

    this.heroCTA = page.getByText(
      'ENCUENTRA TU TALLA',
      { exact: true }
    );

    this.sizeSelectorTitle = page.getByRole('heading', {
      name: '¿Qué talla calzas?',
      exact: true,
    });

  }

  async goto() {
    await this.page.goto('/');
  }

  async goToSizeSelector() {
    await this.heroCTA.click();
  }

  sizeOption(size: string): Locator {
    return this.page.getByRole('link', {
      name: `Ver tenis disponibles en talla ${size}`,
      exact: true,
    });
  }

  async selectSize(size: string) {
    await this.sizeOption(size).click();
  }

}