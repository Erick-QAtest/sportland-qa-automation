import { Page, Locator } from '@playwright/test';

export type SizeStatus =
  | 'AVAILABLE'
  | 'SOLD_OUT'
  | 'MISSING';

export class ProductPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  sizeOption(size: number): Locator {
    return this.page.getByRole('button', {
      name: String(size),
      exact: true
    });
  }

  async getSizeStatus(
    size: number
  ): Promise<SizeStatus> {
    const option =
      this.sizeOption(size);

    const count =
      await option.count();

    if (count === 0) {
      return 'MISSING';
    }

    const enabled =
      await option.isEnabled();

    if (enabled) {
      return 'AVAILABLE';
    }

    return 'SOLD_OUT';
  }

  async isSizeAvailable(
    size: number
  ): Promise<boolean> {
    const status =
      await this.getSizeStatus(size);

    return status === 'AVAILABLE';
  }
}