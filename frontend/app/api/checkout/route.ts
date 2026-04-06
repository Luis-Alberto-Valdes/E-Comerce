import { NextRequest, NextResponse } from 'next/server'

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
const adminAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_API_ADMIN_ACCESS_TOKEN

export async function POST (req: NextRequest) {
  try {
    console.log('=== CHECKOUT API (DRAFT ORDER REST) START ===')
    console.log('Domain:', domain)
    console.log('Admin Token exists:', !!adminAccessToken)

    const body = await req.json()
    console.log('Request body:', JSON.stringify(body, null, 2))

    const { lineItems } = body

    if (!lineItems || !Array.isArray(lineItems) || lineItems.length === 0) {
      console.log('ERROR: No lineItems provided')
      return NextResponse.json(
        { error: 'Se requieren lineItems válidos' },
        { status: 400 }
      )
    }

    // Extraer los IDs numéricos de los GIDs
    const restLineItems = lineItems.map((item: { variantId: string; quantity: number }) => {
      const rawId = item.variantId.split('/').pop() || item.variantId
      return {
        variant_id: parseInt(rawId, 10),
        quantity: item.quantity,
        requires_shipping: false,
        fulfillment_service: 'manual',
        gift_card: false
      }
    })

    console.log('REST Line Items:', JSON.stringify(restLineItems, null, 2))

    const endpoint = `https://${domain}/admin/api/2024-01/draft_orders.json`
    console.log('Endpoint:', endpoint)

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminAccessToken as string,
      },
      body: JSON.stringify({
        draft_order: {
          line_items: restLineItems,
          requires_shipping: false, // Esto elimina la dirección de envío
          note: 'Pedido digital - sin envío requerido'
        }
      }),
    })

    console.log('Response status:', res.status)
    console.log('Response ok:', res.ok)

    const result = await res.json()
    console.log('Response body:', JSON.stringify(result, null, 2))

    if (!result.draft_order) {
      console.log('ERROR: No draft_order in response')
      return NextResponse.json(
        { error: 'Respuesta inesperada de Shopify', details: result },
        { status: 500 }
      )
    }

    if (result.errors) {
      console.log('ERROR: Shopify errors:', result.errors)
      return NextResponse.json(
        { error: 'Error al crear el pedido' },
        { status: 400 }
      )
    }

    console.log('SUCCESS: Invoice URL:', result.draft_order.invoice_url)
    return NextResponse.json({
      id: result.draft_order.id,
      invoiceUrl: result.draft_order.invoice_url,
      name: result.draft_order.name
    })
  } catch (error) {
    console.error('Checkout API error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
