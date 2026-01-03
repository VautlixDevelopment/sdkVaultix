/**
 * Basic Usage Example
 *
 * Run with: npx ts-node examples/basic-usage.ts
 */

import Vaultix from '../src/index.js'

async function main() {
  // Initialize with test key
  const vaultix = new Vaultix({
    secretKey: 'sk_test_your_key_here',
  })

  console.log('Test Mode:', vaultix.isTestMode)

  try {
    // Create a customer
    console.log('\n--- Creating Customer ---')
    const customer = await vaultix.customers.create({
      name: 'João Silva',
      email: 'joao@example.com',
      document: '12345678900',
    })
    console.log('Customer created:', customer.id)

    // Create a PIX charge
    console.log('\n--- Creating PIX Charge ---')
    const pixCharge = await vaultix.charges.create({
      amount: 5000, // R$ 50,00
      payment_method: 'pix',
      customer: {
        id: customer.id,
      },
      description: 'Test purchase',
    })
    console.log('Charge created:', pixCharge.id)
    console.log('Status:', pixCharge.status)
    console.log('PIX QR Code:', pixCharge.pix?.qr_code?.substring(0, 50) + '...')

    // Simulate payment (test mode only)
    if (vaultix.isTestMode) {
      console.log('\n--- Simulating Payment ---')
      const paidCharge = await vaultix.sandbox.payCharge(pixCharge.id)
      console.log('Charge status after payment:', paidCharge.status)
    }

    // Check balance
    console.log('\n--- Checking Balance ---')
    const balance = await vaultix.balance.retrieve()
    console.log('Available:', balance.available[0].amount / 100, 'BRL')
    console.log('Pending:', balance.pending[0].amount / 100, 'BRL')

    // Create a payment link
    console.log('\n--- Creating Payment Link ---')
    const link = await vaultix.paymentLinks.create({
      amount: 10000,
      description: 'Product Purchase',
      payment_methods: ['pix', 'credit_card'],
    })
    console.log('Payment Link URL:', link.url)

    // List test cards
    console.log('\n--- Available Test Cards ---')
    const testCards = await vaultix.sandbox.listTestCards()
    for (const card of testCards.data.slice(0, 3)) {
      console.log(`${card.number} (${card.brand}): ${card.description}`)
    }

  } catch (error) {
    console.error('Error:', error)
  }
}

main()
