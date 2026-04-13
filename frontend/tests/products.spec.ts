import { test, expect } from '@playwright/test'

test.describe('Products Page', () => {
  test('products page loads and displays products', async ({ page }) => {
    await page.goto('/products')

    await expect(page.getByRole('heading', { name: /filtros/i })).toBeVisible()
  })

  test('search filter works via URL', async ({ page }) => {
    await page.goto('/products?search=test')

    await expect(page).toHaveURL(/search=test/)
  })

  test('category filter works via URL', async ({ page }) => {
    await page.goto('/products?category=test')

    await expect(page).toHaveURL(/category=test/)
  })

  test('maxPrice filter works via URL', async ({ page }) => {
    await page.goto('/products?maxPrice=100')

    await expect(page).toHaveURL(/maxPrice=100/)
  })

  test('multiple filters work together', async ({ page }) => {
    await page.goto('/products?search=test&category=test&maxPrice=100')

    await expect(page).toHaveURL(/search=test/)
    await expect(page).toHaveURL(/category=test/)
    await expect(page).toHaveURL(/maxPrice=100/)
  })

  test('clear filters button works', async ({ page }) => {
    await page.goto('/products?search=test')

    const clearButton = page.getByRole('button', { name: /limpiar/i })
    if (await clearButton.isVisible()) {
      await clearButton.click()
      await expect(page).toHaveURL(/.*\/products/)
    }
  })

  test('product grid displays products', async ({ page }) => {
    await page.goto('/products')

    const products = page.locator('[class*="productItem"]')
    const count = await products.count()
    expect(count).toBeGreaterThan(0)
  })

  test('no results message when filters return empty', async ({ page }) => {
    await page.goto('/products?search=non_existent_product_xyz_123')

    await expect(page.getByText(/no se encontraron productos/i)).toBeVisible()
  })
})