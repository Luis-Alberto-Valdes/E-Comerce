// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Homepage', () => {
  test('homepage loads with title and description', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: /los mejores productos/i })).toBeVisible();
  });

  test('homepage button navigates to products', async ({ page }) => {
    await page.goto('/');

    const productsLink = page.getByRole('link', { name: /productos/i });
    await expect(productsLink).toBeVisible();

    await productsLink.click();

    await expect(page).toHaveURL(/.*\/products/);
  });
});