/**
 * Vaultix SDK
 *
 * Official Node.js/TypeScript SDK for the Vaultix Payment API
 */

import { VaultixClient } from './client.js'
import {
  Charges,
  Customers,
  Tokens,
  Refunds,
  BalanceResource,
  PaymentLinks,
  Payouts,
  Sandbox,
  Products,
  Orders,
  Transactions,
} from './resources/index.js'
import type { VaultixConfig } from './types.js'

export class Vaultix {
  private readonly client: VaultixClient

  /** Charges API - Create and manage payment charges */
  readonly charges: Charges

  /** Customers API - Create and manage customers */
  readonly customers: Customers

  /** Tokens API - Tokenize credit card data */
  readonly tokens: Tokens

  /** Refunds API - Create and manage refunds */
  readonly refunds: Refunds

  /** Balance API - Retrieve account balance and transactions */
  readonly balance: BalanceResource

  /** Payment Links API - Create shareable payment links */
  readonly paymentLinks: PaymentLinks

  /** Payouts API - Create withdrawals to bank accounts */
  readonly payouts: Payouts

  /** Sandbox API - Test mode utilities (only works with sk_test_) */
  readonly sandbox: Sandbox

  /** Products API - Create and manage products */
  readonly products: Products

  /** Orders API - Retrieve and manage orders */
  readonly orders: Orders

  /** Transactions API - Unified transaction history */
  readonly transactions: Transactions

  /**
   * Create a new Vaultix SDK instance
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
   * })
   * ```
   *
   * @example Test Mode
   * ```ts
   * const vaultix = new Vaultix({
   *   secretKey: 'sk_test_...',
   * })
   *
   * // Create a charge and simulate payment
   * const charge = await vaultix.charges.create({
   *   amount: 5000,
   *   payment_method: 'pix',
   * })
   *
   * // Simulate the PIX being paid
   * await vaultix.sandbox.payCharge(charge.id)
   * ```
   */
  constructor(config: VaultixConfig) {
    this.client = new VaultixClient(config)

    // Initialize resources
    this.charges = new Charges(this.client)
    this.customers = new Customers(this.client)
    this.tokens = new Tokens(this.client)
    this.refunds = new Refunds(this.client)
    this.balance = new BalanceResource(this.client)
    this.paymentLinks = new PaymentLinks(this.client)
    this.payouts = new Payouts(this.client)
    this.sandbox = new Sandbox(this.client)
    this.products = new Products(this.client)
    this.orders = new Orders(this.client)
    this.transactions = new Transactions(this.client)
  }

  /**
   * Check if the SDK is configured for test mode
   */
  get isTestMode(): boolean {
    return this.client.isTestMode
  }
}

export default Vaultix
