=== CHECKOUT API (DRAFT ORDER) START ===
Domain: test-shop-234576183295487458601.myshopify.com
Admin Token exists: true
Request body: {
  "lineItems": [
    {
      "variantId": "gid://shopify/ProductVariant/48463078981849",
      "quantity": 1
    }
  ]
}
Variables: {
  "input": {
    "lineItems": [
      {
        "variantId": "gid://shopify/ProductVariant/48463078981849",
        "quantity": 1
      }
    ]
  }
}
Endpoint: https://test-shop-234576183295487458601.myshopify.com/admin/api/2024-0
1/graphql.json
Response status: 200
Response ok: true
Response body: {
  "errors": [
    {
      "message": "Selections can't be made on scalars (field 'totalPrice' return
s Money but has selections [\"amount\", \"currencyCode\"])",
      "locations": [
        {
          "line": 8,
          "column": 13
        }
      ],
      "path": [
        "mutation draftOrderCreate",
        "draftOrderCreate",
        "draftOrder",
        "totalPrice"
      ],
      "extensions": {
        "code": "selectionMismatch",
        "nodeName": "field 'totalPrice'",
        "typeName": "Money"
      }
    }
  ]
}
ERROR: No draftOrderCreate in response
 POST /api/checkout 500 in 926ms (compile: 141ms, render: 784ms)
