# Vaultix SDK

Official Node.js/TypeScript SDK for the Vaultix Payment API.

## Installation

```bash
npm install github:VautlixDevelopment/sdkVaultix
```

## Quick Start

```typescript
import Vaultix from 'sdkvaultix'

const vaultix = new Vaultix({
  secretKey: 'sk_live_...',
})

// Create a PIX charge
const charge = await vaultix.charges.create({
  amount: 5000, // R$ 50.00 (in cents)
  payment_method: 'pix',
  customer: {
    name: 'João Silva',
    email: 'joao@email.com',
  },
})

console.log(charge.pix?.qr_code)
```

## API Resources

### Charges

Create and manage payment charges (PIX, Credit Card, Boleto).

```typescript
// Create a PIX charge
const pixCharge = await vaultix.charges.create({
  amount: 10000, // R$ 100.00
  payment_method: 'pix',
  description: 'Order #1234',
  customer: {
    name: 'João Silva',
    email: 'joao@email.com',
    document: '12345678900',
  },
})

// Create a credit card charge
const cardCharge = await vaultix.charges.create({
  amount: 10000,
  payment_method: 'credit_card',
  card: {
    token: 'tok_...',
    installments: 3,
    capture: true, // auto-capture (default)
  },
})

// Create a boleto charge
const boletoCharge = await vaultix.charges.create({
  amount: 10000,
  payment_method: 'boleto',
  boleto: {
    due_date: '2025-02-15',
    instructions: 'Pay before due date',
  },
})

// Retrieve a charge
const charge = await vaultix.charges.retrieve('ch_...')

// List charges
const charges = await vaultix.charges.list({
  limit: 20,
  status: 'paid',
  payment_method: 'pix',
})

// Capture a pre-authorized charge
await vaultix.charges.capture('ch_...', { amount: 5000 }) // optional partial capture

// Cancel a pending charge
await vaultix.charges.cancel('ch_...')
```

### Customers

```typescript
// Create a customer
const customer = await vaultix.customers.create({
  name: 'Maria Santos',
  email: 'maria@email.com',
  document: '12345678900',
  phone: '+5511999999999',
  address: {
    street: 'Rua Example',
    number: '123',
    city: 'São Paulo',
    state: 'SP',
    postal_code: '01234-567',
  },
})

// Retrieve a customer
const customer = await vaultix.customers.retrieve('cus_...')

// Update a customer
await vaultix.customers.update('cus_...', {
  phone: '+5511888888888',
  metadata: { vip: true },
})

// List customers
const customers = await vaultix.customers.list({
  limit: 20,
  email: 'maria@email.com',
})

// Delete a customer
await vaultix.customers.delete('cus_...')
```

### Refunds

```typescript
// Full refund
const refund = await vaultix.refunds.create({
  charge: 'ch_...',
  reason: 'requested_by_customer',
})

// Partial refund
const refund = await vaultix.refunds.create({
  charge: 'ch_...',
  amount: 2500, // R$ 25.00
  reason: 'requested_by_customer',
})

// Retrieve a refund
const refund = await vaultix.refunds.retrieve('re_...')

// List refunds
const refunds = await vaultix.refunds.list({
  charge: 'ch_...',
  limit: 10,
})
```

### Balance

```typescript
// Get current balance
const balance = await vaultix.balance.retrieve()
console.log('Available:', balance.available[0].amount / 100)
console.log('Pending:', balance.pending[0].amount / 100)

// List balance transactions
const transactions = await vaultix.balance.listTransactions({
  limit: 20,
  type: 'charge', // or 'refund'
})
```

### Products

```typescript
// Create a product
const product = await vaultix.products.create({
  name: 'Premium T-Shirt',
  description: 'High quality cotton t-shirt',
  price: 7990, // R$ 79.90
  sku: 'TSHIRT-001',
  stock_quantity: 100,
  status: 'active',
  is_featured: true,
})

// Retrieve a product
const product = await vaultix.products.retrieve('prod_...')

// Update a product
await vaultix.products.update('prod_...', {
  price: 6990,
  stock_quantity: 50,
})

// List products
const products = await vaultix.products.list({
  limit: 20,
  status: 'active',
  is_featured: true,
  search: 't-shirt',
})

// Delete a product
await vaultix.products.delete('prod_...')
```

### Orders

```typescript
// Retrieve an order
const order = await vaultix.orders.retrieve('order_...', {
  expand: 'items',
})

// List orders
const orders = await vaultix.orders.list({
  limit: 20,
  status: 'completed',
  payment_status: 'paid',
  expand: 'items',
})

// Get order items
const items = await vaultix.orders.listItems('order_...')
```

### Transactions

Unified transaction history across charges, refunds, and payouts.

```typescript
// Retrieve a transaction
const transaction = await vaultix.transactions.retrieve('ch_...')

// List all transactions
const transactions = await vaultix.transactions.list({
  limit: 50,
  type: 'charge', // 'charge' | 'refund' | 'payout'
  source: 'charge',
  payment_method: 'pix',
  created_gte: '2025-01-01',
  created_lte: '2025-01-31',
})

// Get transaction summary
const summary = await vaultix.transactions.summary({
  period: '30d', // '24h' | '7d' | '30d' | '90d'
})
console.log('Net amount:', summary.net_amount / 100)
```

### Payment Links

```typescript
// Create a payment link
const link = await vaultix.paymentLinks.create({
  amount: 10000, // R$ 100.00
  description: 'Product Purchase',
  payment_methods: ['pix', 'credit_card'],
  success_url: 'https://mysite.com/success',
  cancel_url: 'https://mysite.com/cancel',
  expires_at: '2025-02-01T00:00:00Z',
  max_uses: 10,
})

console.log(link.url) // Share this with your customer

// Retrieve a payment link
const link = await vaultix.paymentLinks.retrieve('plink_...')

// List payment links
const links = await vaultix.paymentLinks.list({
  limit: 20,
  status: 'active',
})

// Deactivate a link
await vaultix.paymentLinks.deactivate('plink_...')

// List payments made through a link
const payments = await vaultix.paymentLinks.listPayments('plink_...')
```

### Payouts

```typescript
// PIX payout
const payout = await vaultix.payouts.create({
  amount: 50000, // R$ 500.00
  destination: {
    pix_key: 'email@example.com',
    holder_name: 'João Silva',
  },
  description: 'Monthly withdrawal',
})

// Bank transfer payout
const payout = await vaultix.payouts.create({
  amount: 100000, // R$ 1,000.00
  destination: {
    bank_code: '001',
    branch: '1234',
    account: '12345-6',
    account_type: 'checking',
    holder_name: 'João Silva',
    holder_document: '12345678900',
  },
})

// Retrieve a payout
const payout = await vaultix.payouts.retrieve('po_...')

// List payouts
const payouts = await vaultix.payouts.list({
  limit: 20,
  status: 'pending',
})

// Cancel a pending payout
await vaultix.payouts.cancel('po_...')
```

## Test Mode (Sandbox)

Use test API keys (`sk_test_...`) to test your integration without processing real payments.

```typescript
const vaultix = new Vaultix({
  secretKey: 'sk_test_...',
})

// Create a test charge
const charge = await vaultix.charges.create({
  amount: 5000,
  payment_method: 'pix',
})

// Simulate payment (test mode only)
await vaultix.sandbox.payCharge(charge.id)

// Simulate failure
await vaultix.sandbox.failCharge(charge.id, {
  failure_code: 'insufficient_funds',
})

// Test webhook delivery
await vaultix.sandbox.testWebhook({
  url: 'https://mysite.com/webhooks',
  event: 'charge.paid',
})
```

### Test Cards

| Number | Brand | Behavior |
|--------|-------|----------|
| 4242424242424242 | Visa | Success |
| 4000000000000002 | Visa | Declined |
| 4000000000009995 | Visa | Insufficient funds |
| 5555555555554444 | Mastercard | Success |
| 378282246310005 | Amex | Success |

## Error Handling

```typescript
import Vaultix, { VaultixAPIError } from 'sdkvaultix'

try {
  await vaultix.charges.create({ amount: 50, payment_method: 'pix' })
} catch (error) {
  if (error instanceof VaultixAPIError) {
    console.error('Code:', error.code)        // 'parameter_invalid'
    console.error('Message:', error.message)  // 'amount deve ser pelo menos 100'
    console.error('Param:', error.param)      // 'amount'
    console.error('Status:', error.statusCode) // 400
  }
}
```

## Configuration Options

```typescript
const vaultix = new Vaultix({
  secretKey: 'sk_live_...',
  baseUrl: 'https://console.velon.app/api', // Default
  timeout: 30000, // 30 seconds (default)
  maxRetries: 3, // Retry failed requests (default)
})
```

## TypeScript

The SDK is written in TypeScript and includes full type definitions.

```typescript
import Vaultix, { Charge, ChargeCreateParams } from 'sdkvaultix'

const params: ChargeCreateParams = {
  amount: 5000,
  payment_method: 'pix',
}

const charge: Charge = await vaultix.charges.create(params)
```

## Webhooks

Configure webhooks in your Vaultix dashboard to receive real-time notifications.

### Available Events

| Event | Description |
|-------|-------------|
| `charge.created` | Charge was created |
| `charge.paid` | Charge was paid |
| `charge.captured` | Charge was captured |
| `charge.canceled` | Charge was canceled |
| `charge.refunded` | Charge was refunded |
| `refund.created` | Refund was created |
| `refund.succeeded` | Refund succeeded |
| `customer.created` | Customer was created |
| `customer.updated` | Customer was updated |
| `customer.deleted` | Customer was deleted |
| `payout.created` | Payout was created |
| `payout.canceled` | Payout was canceled |
| `product.created` | Product was created |
| `product.updated` | Product was updated |
| `product.deleted` | Product was deleted |

### Webhook Signature Verification

```typescript
const crypto = require('crypto')

function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')

  return signature === `sha256=${expectedSignature}`
}

// In your webhook handler
app.post('/webhooks', (req, res) => {
  const signature = req.headers['x-vaultix-signature']
  const isValid = verifyWebhookSignature(JSON.stringify(req.body), signature, 'whsec_...')

  if (!isValid) {
    return res.status(401).send('Invalid signature')
  }

  const event = req.body

  switch (event.type) {
    case 'charge.paid':
      // Handle paid charge
      break
    case 'refund.succeeded':
      // Handle refund
      break
  }

  res.status(200).send('OK')
})
```

## Requirements

- Node.js 18+
- TypeScript 5+ (if using TypeScript)

## Documentation

Full API documentation: https://vaultix.global/developers/docs

## License

MIT
