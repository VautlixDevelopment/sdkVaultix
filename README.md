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
  amount: 5000, // R$ 50,00 (in cents)
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
  amount: 10000,
  payment_method: 'pix',
})

// Create a credit card charge
const cardCharge = await vaultix.charges.create({
  amount: 10000,
  payment_method: 'credit_card',
  card: {
    token: 'tok_...',
    installments: 3,
  },
})

// Retrieve a charge
const charge = await vaultix.charges.retrieve('ch_...')

// List charges
const charges = await vaultix.charges.list({ limit: 20, status: 'paid' })

// Capture a pre-authorized charge
await vaultix.charges.capture('ch_...')

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
})

// Update a customer
await vaultix.customers.update('cus_...', { phone: '+5511999999999' })

// List customers
const customers = await vaultix.customers.list({ limit: 20 })
```

### Tokens

Tokenize credit card data for secure payments.

```typescript
const token = await vaultix.tokens.create({
  card: {
    number: '4242424242424242',
    exp_month: 12,
    exp_year: 2025,
    cvc: '123',
    name: 'João Silva',
  },
})

// Use the token in a charge
const charge = await vaultix.charges.create({
  amount: 5000,
  payment_method: 'credit_card',
  card: { token: token.id },
})
```

### Refunds

```typescript
// Full refund
const refund = await vaultix.refunds.create({
  charge: 'ch_...',
})

// Partial refund
const refund = await vaultix.refunds.create({
  charge: 'ch_...',
  amount: 2500, // R$ 25,00
})

// List refunds for a charge
const refunds = await vaultix.refunds.list({ charge: 'ch_...' })
```

### Balance

```typescript
// Get current balance
const balance = await vaultix.balance.retrieve()
console.log('Available:', balance.available[0].amount / 100)

// List balance transactions
const transactions = await vaultix.balance.listTransactions({ limit: 20 })
```

### Payment Links

```typescript
// Create a payment link
const link = await vaultix.paymentLinks.create({
  amount: 10000,
  description: 'Product Purchase',
  success_url: 'https://mysite.com/success',
  payment_methods: ['pix', 'credit_card'],
})

console.log(link.url) // Share this with your customer

// Deactivate a link
await vaultix.paymentLinks.deactivate('plink_...')

// List payments made through a link
const payments = await vaultix.paymentLinks.listPayments('plink_...')
```

### Payouts

```typescript
// PIX payout
const payout = await vaultix.payouts.create({
  amount: 50000,
  destination: {
    pix_key: 'email@example.com',
    holder_name: 'João Silva',
  },
})

// Bank transfer payout
const payout = await vaultix.payouts.create({
  amount: 100000,
  destination: {
    bank_code: '001',
    branch: '1234',
    account: '12345-6',
    account_type: 'checking',
    holder_name: 'João Silva',
    holder_document: '12345678900',
  },
})

// Cancel a pending payout
await vaultix.payouts.cancel('po_...')
```

## Test Mode

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

// Simulate payment
await vaultix.sandbox.payCharge(charge.id)

// Simulate failure
await vaultix.sandbox.failCharge(charge.id, {
  failure_code: 'insufficient_funds',
})

// List available test cards
const testCards = await vaultix.sandbox.listTestCards()
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
import Vaultix, { VaultixAPIError } from '@vaultix/sdk'

try {
  await vaultix.charges.create({ amount: 50 }) // Too low
} catch (error) {
  if (error instanceof VaultixAPIError) {
    console.error(error.code)      // 'parameter_invalid'
    console.error(error.message)   // 'amount deve ser pelo menos 100'
    console.error(error.param)     // 'amount'
    console.error(error.statusCode) // 400
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
import Vaultix, { Charge, ChargeCreateParams } from '@vaultix/sdk'

const params: ChargeCreateParams = {
  amount: 5000,
  payment_method: 'pix',
}

const charge: Charge = await vaultix.charges.create(params)
```

## Requirements

- Node.js 18+
- TypeScript 5+ (if using TypeScript)

## Documentation

Full API documentation: https://vaultix.global/developers/docs

## License

MIT
