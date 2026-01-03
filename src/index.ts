/**
 * @vaultix/sdk
 *
 * Official Node.js/TypeScript SDK for the Vaultix Payment API
 *
 * @example
 * ```ts
 * import Vaultix from '@vaultix/sdk'
 *
 * const vaultix = new Vaultix({
 *   secretKey: 'sk_live_...',
 * })
 *
 * // Create a PIX charge
 * const charge = await vaultix.charges.create({
 *   amount: 5000, // R$ 50,00
 *   payment_method: 'pix',
 *   customer: {
 *     name: 'João Silva',
 *     email: 'joao@email.com',
 *   },
 * })
 *
 * console.log(charge.pix?.qr_code)
 * ```
 *
 * @packageDocumentation
 */

// Main class
export { Vaultix, default } from './vaultix.js'

// Error class
export { VaultixAPIError } from './client.js'

// Types
export type {
  // Config
  VaultixConfig,
  VaultixError,

  // Common
  ListParams,
  ListResponse,
  Currency,
  PaymentMethod,
  Environment,

  // Charges
  Charge,
  ChargeCreateParams,
  ChargeListParams,

  // Customers
  Customer,
  CustomerCreateParams,
  CustomerUpdateParams,

  // Tokens
  Token,
  TokenCreateParams,

  // Refunds
  Refund,
  RefundCreateParams,
  RefundListParams,

  // Balance
  Balance,
  BalanceTransaction,
  BalanceTransactionListParams,

  // Payment Links
  PaymentLink,
  PaymentLinkCreateParams,
  PaymentLinkListParams,

  // Payouts
  Payout,
  PayoutCreateParams,
  PayoutListParams,

  // Sandbox
  TestCard,
  SandboxChargePayParams,
  SandboxChargeFailParams,
  SandboxWebhookTestParams,
} from './types.js'
