import { expect, test, type Page } from '@playwright/test';

const VALID_USERNAME = 'standard_user';
const VALID_PASSWORD = 'secret_sauce';
const INVALID_CREDENTIALS_ERROR =
  'Epic sadface: Username and password do not match any user in this service';

async function openLogin(page: Page): Promise<void> {
  await page.goto('/');
  await expect(page.getByTestId('login-button')).toBeVisible();
}

async function login(page: Page, username: string, password: string): Promise<void> {
  await page.getByTestId('username').fill(username);
  await page.getByTestId('password').fill(password);
  await page.getByTestId('login-button').click();
}

async function expectLoginError(page: Page, message: string): Promise<void> {
  await expect(page.getByTestId('error')).toContainText(message);
  await expect(page).toHaveURL(/saucedemo\.com\/?$/);
}

test.describe('SauceDemo login test suite', () => {
  test.beforeEach(async ({ page }) => {
    await openLogin(page);
  });

  test('LOGIN-001 — login with valid credentials', async ({ page }) => {
    await login(page, VALID_USERNAME, VALID_PASSWORD);
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.getByText('Products', { exact: true })).toBeVisible();
  });

  test('LOGIN-002 — login with an invalid password', async ({ page }) => {
    await login(page, VALID_USERNAME, 'wrong_password');
    await expectLoginError(page, INVALID_CREDENTIALS_ERROR);
  });

  test('LOGIN-003 — login with both fields empty', async ({ page }) => {
    await page.getByTestId('login-button').click();
    await expectLoginError(page, 'Epic sadface: Username is required');
  });

  test('LOGIN-004 — login with an invalid username', async ({ page }) => {
    await login(page, 'lucas_test', VALID_PASSWORD);
    await expectLoginError(page, INVALID_CREDENTIALS_ERROR);
  });

  test('LOGIN-005 — login without a username', async ({ page }) => {
    await page.getByTestId('password').fill(VALID_PASSWORD);
    await page.getByTestId('login-button').click();
    await expectLoginError(page, 'Epic sadface: Username is required');
  });

  test('LOGIN-006 — login without a password', async ({ page }) => {
    await page.getByTestId('username').fill(VALID_USERNAME);
    await page.getByTestId('login-button').click();
    await expectLoginError(page, 'Epic sadface: Password is required');
  });

  test('LOGIN-007 — login with a locked-out user', async ({ page }) => {
    await login(page, 'locked_out_user', VALID_PASSWORD);
    await expectLoginError(page, 'Epic sadface: Sorry, this user has been locked out.');
  });

  test('LOGIN-008 — login with an uppercase username', async ({ page }) => {
    await login(page, 'STANDARD_USER', VALID_PASSWORD);
    await expectLoginError(page, INVALID_CREDENTIALS_ERROR);
  });

  test('LOGIN-009 — login with an uppercase password', async ({ page }) => {
    await login(page, VALID_USERNAME, 'SECRET_SAUCE');
    await expectLoginError(page, INVALID_CREDENTIALS_ERROR);
  });

  test('LOGIN-010 — login with spaces around the username', async ({ page }) => {
    await login(page, ` ${VALID_USERNAME} `, VALID_PASSWORD);
    await expectLoginError(page, INVALID_CREDENTIALS_ERROR);
  });

  test('LOGIN-011 — login with spaces around the password', async ({ page }) => {
    await login(page, VALID_USERNAME, ` ${VALID_PASSWORD} `);
    await expectLoginError(page, INVALID_CREDENTIALS_ERROR);
  });

  test('LOGIN-012 — login with special characters', async ({ page }) => {
    await login(page, '!@#$%', '!@#$%');
    await expectLoginError(page, INVALID_CREDENTIALS_ERROR);
    await expect(page.getByTestId('login-button')).toBeEnabled();
  });

  test('LOGIN-013 — login with very long values without breaking the page', async ({ page }) => {
    const longValue = 'abcdefghijklmnopqrstuvwxyz1234567890'.repeat(7);
    await login(page, longValue, longValue);
    await expectLoginError(page, INVALID_CREDENTIALS_ERROR);
    await expect(page.getByTestId('login-container')).toBeVisible();
    await expect(page.getByTestId('login-button')).toBeVisible();
  });

  test('LOGIN-014 — submit the login form using Enter', async ({ page }) => {
    await page.getByTestId('username').fill(VALID_USERNAME);
    await page.getByTestId('password').fill(VALID_PASSWORD);
    await page.getByTestId('password').press('Enter');
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.getByText('Products', { exact: true })).toBeVisible();
  });

  test('LOGIN-015 — close the login error message', async ({ page }) => {
    await login(page, VALID_USERNAME, 'wrong_password');
    await expect(page.getByTestId('error')).toBeVisible();
    await page.getByTestId('error-button').click();
    await expect(page.getByTestId('error')).toBeHidden();
  });

  test('LOGIN-016 — verify password masking', async ({ page }) => {
    const passwordField = page.getByTestId('password');
    await passwordField.fill(VALID_PASSWORD);
    await expect(passwordField).toHaveAttribute('type', 'password');
    await expect(passwordField).toHaveValue(VALID_PASSWORD);
  });

  test('LOGIN-017 — valid login after an invalid attempt', async ({ page }) => {
    await login(page, VALID_USERNAME, 'wrong_password');
    await expectLoginError(page, INVALID_CREDENTIALS_ERROR);

    await page.getByTestId('password').fill(VALID_PASSWORD);
    await page.getByTestId('login-button').click();
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('LOGIN-018 — browser Back button after logout does not restore access', async ({ page }) => {
    await login(page, VALID_USERNAME, VALID_PASSWORD);
    await expect(page).toHaveURL(/inventory\.html/);

    await page.getByRole('button', { name: 'Open Menu' }).click();
    await page.getByTestId('logout-sidebar-link').click();
    await expect(page).toHaveURL(/saucedemo\.com\/?$/);

    await page.goBack();
    await expect(page).toHaveURL(/saucedemo\.com\/?$/);
    await expect(page.getByTestId('login-button')).toBeVisible();
  });

  test('LOGIN-019 — access an internal page without authentication', async ({ page }) => {
    await page.goto('/inventory.html');
    await expect(page).toHaveURL(/saucedemo\.com\/?$/);
    await expect(page.getByTestId('error')).toContainText(
      "Epic sadface: You can only access '/inventory.html' when you are logged in.",
    );
  });

  test('LOGIN-020 — refresh the products page after login', async ({ page }) => {
    await login(page, VALID_USERNAME, VALID_PASSWORD);
    await expect(page).toHaveURL(/inventory\.html/);

    await page.reload();
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.getByText('Products', { exact: true })).toBeVisible();
  });
});
