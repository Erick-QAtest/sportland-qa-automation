import { test, expect } from '../fixtures/auth.fixture';

import {
  validUser,
  invalidPasswordUser,
  invalidUsernameUser
} from '../test-data/users';


test.describe('Authentication', () => {

  test.beforeEach(async ({ loginPage }) => {

    await loginPage.goto();

  });


  test('successful login', async ({ page, loginPage }) => {

    await loginPage.login(
      validUser.username,
      validUser.password
    );

    await expect(page).toHaveURL(/secure/);

    await expect(
      page.getByText('You logged into a secure area!')
    ).toBeVisible();

  });


  test('invalid password', async ({ page, loginPage }) => {

    await loginPage.login(
      invalidPasswordUser.username,
      invalidPasswordUser.password
    );

    await expect(
      page.getByText('Your password is invalid!')
    ).toBeVisible();

  });


  test('invalid username', async ({ page, loginPage }) => {

    await loginPage.login(
      invalidUsernameUser.username,
      invalidUsernameUser.password
    );

    await expect(
      page.getByText('Your username is invalid!')
    ).toBeVisible();

  });


  test('successful logout', async ({ page, loginPage }) => {

    await loginPage.login(
      validUser.username,
      validUser.password
    );

    await expect(page).toHaveURL(/secure/);

    await page
      .getByRole('link', { name: 'Logout' })
      .click();

    await expect(page).toHaveURL(/login/);

  });

});