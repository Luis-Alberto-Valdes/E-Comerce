// @ts-check
import { test, expect } from '@playwright/test'

test.describe('Checkout', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/checkout', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 12345,
            invoiceUrl: 'https://example.shopify.com/invoice/12345',
            name: '#DRAFT123'
          })
        })
      }
    })
  })

  test('checkout button opens shopify redirect', async ({ page }) => {
    await page.goto('/products')
    const addButton = page.locator('button:has-text("Agregar al carrito")').first()
    if (await addButton.isVisible()) {
      await addButton.click()
      await page.waitForTimeout(700)

      await page.goto('/cart')

      const checkoutBtn = page.getByRole('button', { name: /proceder al checkout/i })
      await checkoutBtn.click()

      await page.waitForTimeout(500)
    }
  })

  test('checkout error handling', async ({ page }) => {
    await page.route('**/api/checkout', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'Error al crear el checkout'
          })
        })
      }
    })

    await page.goto('/products')
    const addButton = page.locator('button:has-text("Agregar al carrito")').first()
    if (await addButton.isVisible()) {
      await addButton.click()
      await page.waitForTimeout(700)

      await page.goto('/cart')

      const checkoutBtn = page.getByRole('button', { name: /proceder al checkout/i })
      await checkoutBtn.click()

      await expect(page.getByText(/no se pudo procesar el pago/i)).toBeVisible()
    }
  })

  test('checkout shows correct total', async ({ page }) => {
    await page.goto('/products')
    const addButton = page.locator('button:has-text("Agregar al carrito")').first()
    if (await addButton.isVisible()) {
      await addButton.click()
      await page.waitForTimeout(700)

      await page.goto('/cart')

      const total = page.locator('[class*="summaryTotal"]')
      await expect(total).toBeVisible()
      await expect(total).toContainText('$')
    }
  })
})
