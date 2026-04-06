const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN

export async function shopifyFetch ({ query, variables }) {
  const endpoint = `https://${domain}/api/2024-01/graphql.json`

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
    },
    body: JSON.stringify({ query, variables }),
  })

  if (!res.ok) {
    throw new Error('Error al conectar con Shopify')
  }

  return res.json()
}

interface CheckoutLineItem {
  variantId: string
  quantity: number
}

export async function createCheckout (lineItems: CheckoutLineItem[]) {
  const query = `
    mutation checkoutCreate($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout {
          id
          webUrl
          totalPriceV2 {
            amount
            currencyCode
          }
          lineItems(first: 250) {
            edges {
              node {
                id
                title
                quantity
                variant {
                  id
                  title
                }
              }
            }
          }
        }
        checkoutUserErrors {
          field
          message
        }
      }
    }
  `

  const variables = {
    input: {
      lineItems: lineItems.map(item => ({
        variantId: `${item.variantId}`,
        quantity: item.quantity,
      })),
    },
  }

  const result = await shopifyFetch({ query, variables })

  if (!result.data?.checkoutCreate) {
    throw new Error('No se pudo crear el checkout. Respuesta inesperada de Shopify.')
  }

  if (result.data.checkoutCreate.checkoutUserErrors?.length > 0) {
    throw new Error(result.data.checkoutCreate.checkoutUserErrors.map((e: { message: string }) => e.message).join(', '))
  }

  return result.data.checkoutCreate.checkout
}
