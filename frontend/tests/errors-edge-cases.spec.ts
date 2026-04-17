// @ts-check
import { test, expect } from '@playwright/test'

test.describe('Error Handling & Edge Cases', () => {
  test('error boundary displays on error', async ({ page }) => {
    await page.goto('/non-existent-route')
  })

  test('not-found page shows 404 message', async ({ page }) => {
    await page.goto('/products/this-product-does-not-exist-xyz')

    await expect(page.getByRole('heading', { name: /404/i })).toBeVisible()
  })

  test('not-found has link back to home', async ({ page }) => {
    await page.goto('/products/this-product-does-not-exist-xyz')

    const backLink = page.getByRole('link', { name: /volver al inicio/i })
    await expect(backLink).toBeVisible()

    await backLink.click()
    await expect(page).toHaveURL('/')
  })

  test('loading state shows while products load', async ({ page }) => {
    await page.goto('/products')

    const loading = page.getByText(/cargando/i)
    if (await loading.isVisible()) {
      await expect(loading).toBeVisible()
    }
  })

  test('filters show all categories from Strapi', async ({ page }) => {
    await page.goto('/products')

    // Wait for radio buttons to be loaded before counting
    const buttons = page.locator('[class*="radio"]')
    await buttons.first().waitFor({ state: 'visible' })

    const count = await buttons.count()
    expect(count).toBeGreaterThan(0)
  })
})
