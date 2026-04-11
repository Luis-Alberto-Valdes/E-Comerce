// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Cart', () => {
  test('empty cart shows empty state message', async ({ page }) => {
    await page.goto('/cart');

    await expect(page.getByRole('heading', { name: /tu carrito está vacío/i })).toBeVisible();
  });

  test('empty cart has link to products', async ({ page }) => {
    await page.goto('/cart');

    const link = page.getByRole('link', { name: /ver productos/i });
    await expect(link).toBeVisible();

    await link.click();
    await expect(page).toHaveURL(/.*\/products/);
  });

  test('add product to cart updates badge', async ({ page }) => {
    await page.goto('/products');

    const addButton = page.locator('button:has-text("Agregar al carrito")').first();
    if (await addButton.isVisible()) {
      await addButton.click();

      await page.waitForTimeout(700);

      const badge = page.locator('[class*="badge"]');
      await expect(badge).toBeVisible();
    }
  });

  test('quantity buttons update total', async ({ page }) => {
    await page.goto('/products');
    const addButton = page.locator('button:has-text("Agregar al carrito")').first();
    if (await addButton.isVisible()) {
      await addButton.click();
      await page.waitForTimeout(700);

      await page.goto('/cart');

      const increaseBtn = page.getByRole('button', { name: /aumentar/i });
      if (await increaseBtn.isVisible()) {
        const initialTotal = await page.locator('[class*="summaryTotal"]').textContent();

        await increaseBtn.click();

        await expect(page.locator('[class*="summaryTotal"]')).not.toHaveText(initialTotal);
      }
    }
  });

  test('remove item from cart', async ({ page }) => {
    await page.goto('/products');
    const addButton = page.locator('button:has-text("Agregar al carrito")').first();
    if (await addButton.isVisible()) {
      await addButton.click();
      await page.waitForTimeout(700);

      await page.goto('/cart');

      const removeBtn = page.getByRole('button', { name: /eliminar/i });
      if (await removeBtn.isVisible()) {
        await removeBtn.click();

        await expect(page.getByRole('heading', { name: /tu carrito está vacío/i })).toBeVisible();
      }
    }
  });

  test('clear cart button works', async ({ page }) => {
    await page.goto('/products');
    const addButton = page.locator('button:has-text("Agregar al carrito")').first();
    if (await addButton.isVisible()) {
      await addButton.click();
      await page.waitForTimeout(700);

      await page.goto('/cart');

      const clearBtn = page.getByRole('button', { name: /limpiar carrito/i });
      if (await clearBtn.isVisible()) {
        await clearBtn.click();

        await expect(page.getByRole('heading', { name: /tu carrito está vacío/i })).toBeVisible();
      }
    }
  });

  test('cart persists when navigating', async ({ page }) => {
    await page.goto('/products');
    const addButton = page.locator('button:has-text("Agregar al carrito")').first();
    if (await addButton.isVisible()) {
      await addButton.click();
      await page.waitForTimeout(700);

      await page.goto('/');
      await page.goto('/cart');

      const badge = page.locator('[class*="badge"]');
      await expect(badge).toBeVisible();
    }
  });
});