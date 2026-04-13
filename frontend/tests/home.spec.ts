import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('homepage loads with title and description', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: /los mejores productos/i })).toBeVisible()
  })

  test('homepage button navigates to products', async ({ page }) => {
    await page.goto('/')

    const productsLink = page.getByRole('link', { name: /productos/i })
    await expect(productsLink).toBeVisible()

    await productsLink.click()

    await page.waitForURL(/.*\/products/)
  })
})