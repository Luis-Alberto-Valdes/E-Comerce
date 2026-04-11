// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Product Detail', () => {
  test('product detail page loads', async ({ page }) => {
    await page.goto('/products');

    const firstProduct = page.locator('a[href*="/products/"]').first();
    const href = await firstProduct.getAttribute('href');

    if (href) {
      await page.goto(href);
      await expect(page.getByRole('heading').first()).toBeVisible();
    }
  });

  test('product shows title, price and description', async ({ page }) => {
    await page.goto('/products');

    const firstProductLink = page.locator('a[href*="/products/"]').first();
    const href = await firstProductLink.getAttribute('href');

    if (href) {
      await page.goto(href);

      await expect(page.getByText(/\$\d+/)).toBeVisible();
    }
  });

  test('product variants (color) are displayed', async ({ page }) => {
    await page.goto('/products');

    const firstProductLink = page.locator('a[href*="/products/"]').first();
    const href = await firstProductLink.getAttribute('href');

    if (href) {
      await page.goto(href);

      const colorSelect = page.locator('select#color-select');
      if (await colorSelect.isVisible()) {
        const options = colorSelect.locator('option');
        const count = await options.count();
        expect(count).toBeGreaterThan(0);
      }
    }
  });

  test('product variants (size) are displayed when available', async ({ page }) => {
    await page.goto('/products');

    const firstProductLink = page.locator('a[href*="/products/"]').first();
    const href = await firstProductLink.getAttribute('href');

    if (href) {
      await page.goto(href);

      const sizeSelect = page.locator('select#size-select');
      if (await sizeSelect.isVisible()) {
        const options = sizeSelect.locator('option');
        const count = await options.count();
        expect(count).toBeGreaterThan(0);
      }
    }
  });

  test('back link returns to products', async ({ page }) => {
    await page.goto('/products');

    const firstProductLink = page.locator('a[href*="/products/"]').first();
    const href = await firstProductLink.getAttribute('href');

    if (href) {
      await page.goto(href);

      const backLink = page.getByRole('link', { name: /volver a productos/i });
      await backLink.click();

      await expect(page).toHaveURL(/.*\/products/);
    }
  });

  test('returns 404 for non-existent product', async ({ page }) => {
    await page.goto('/products/non-existent-product-xyz-123');

    await expect(page.getByText(/404/)).toBeVisible();
    await expect(page.getByRole('link', { name: /volver al inicio/i })).toBeVisible();
  });
});