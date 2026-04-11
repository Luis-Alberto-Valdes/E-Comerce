import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const domain = process.env.SHOPIFY_STORE_DOMAIN
const adminAccessToken = process.env.SHOPIFY_API_ADMIN_ACCESS_TOKEN

const CheckoutSchema = z.object({
  lineItems: z.array(
    z.object({
      variantId: z.string().min(1, 'variantId is required'),
      quantity: z.number().int().positive('quantity must be positive'),
    })
  ).min(1, 'At least one line item is required'),
})

export async function POST (req: NextRequest) {
  try {
    if (!domain || !adminAccessToken) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const body = await req.json()
    const validation = CheckoutSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { lineItems } = validation.data

    const restLineItems = lineItems.map((item) => {
      const rawId = item.variantId.split('/').pop() || item.variantId
      return {
        variant_id: parseInt(rawId, 10),
        quantity: item.quantity,
        requires_shipping: false,
        fulfillment_service: 'manual',
        gift_card: false
      }
    })

    const endpoint = `https://${domain}/admin/api/2024-01/draft_orders.json`

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminAccessToken,
      },
      body: JSON.stringify({
        draft_order: {
          line_items: restLineItems,
          requires_shipping: false,
          note: 'Pedido digital - sin envío requerido'
        }
      }),
    })

    const result = await res.json()

    if (!result.draft_order) {
      return NextResponse.json(
        { error: 'Respuesta inesperada de Shopify', details: result.errors },
        { status: 500 }
      )
    }

    if (result.errors) {
      return NextResponse.json(
        { error: 'Error al crear el pedido' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      id: result.draft_order.id,
      invoiceUrl: result.draft_order.invoice_url,
      name: result.draft_order.name
    })
  } catch (_error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
