/**
 * Sandbox Resource
 *
 * Test mode utilities for simulating events
 *
 * NOTE: These endpoints only work with test mode API keys (sk_test_)
 */

import type { VaultixClient } from '../client.js'
import type {
  Charge,
  Refund,
  TestCard,
  SandboxChargeFailParams,
  SandboxWebhookTestParams,
  ListResponse,
} from '../types.js'

export class Sandbox {
  constructor(private readonly client: VaultixClient) {}

  /**
   * Simulate a PIX payment being received
   *
   * @example
   * ```ts
   * // Create a PIX charge
   * const charge = await vaultix.charges.create({
   *   amount: 5000,
   *   payment_method: 'pix',
   * })
   *
   * // Simulate the customer paying
   * const paidCharge = await vaultix.sandbox.payCharge(charge.id)
   * console.log(paidCharge.status) // 'paid'
   * ```
   */
  async payCharge(chargeId: string): Promise<Charge> {
    return this.client.post<Charge>(`/v1/sandbox/charges/${chargeId}/pay`)
  }

  /**
   * Simulate a charge failure
   *
   * @example
   * ```ts
   * const failedCharge = await vaultix.sandbox.failCharge('ch_abc123', {
   *   failure_code: 'insufficient_funds',
   *   failure_message: 'Saldo insuficiente',
   * })
   * ```
   */
  async failCharge(chargeId: string, params?: SandboxChargeFailParams): Promise<Charge> {
    return this.client.post<Charge>(`/v1/sandbox/charges/${chargeId}/fail`, params)
  }

  /**
   * Simulate a charge expiration
   *
   * @example
   * ```ts
   * const expiredCharge = await vaultix.sandbox.expireCharge('ch_abc123')
   * console.log(expiredCharge.status) // 'expired'
   * ```
   */
  async expireCharge(chargeId: string): Promise<Charge> {
    return this.client.post<Charge>(`/v1/sandbox/charges/${chargeId}/expire`)
  }

  /**
   * Simulate a refund being processed successfully
   *
   * @example
   * ```ts
   * const refund = await vaultix.refunds.create({ charge: 'ch_abc123' })
   * const succeededRefund = await vaultix.sandbox.succeedRefund(refund.id)
   * console.log(succeededRefund.status) // 'succeeded'
   * ```
   */
  async succeedRefund(refundId: string): Promise<Refund> {
    return this.client.post<Refund>(`/v1/sandbox/refunds/${refundId}/succeed`)
  }

  /**
   * Send a test webhook to your configured endpoint
   *
   * @example
   * ```ts
   * const result = await vaultix.sandbox.testWebhook({
   *   event_type: 'charge.paid',
   *   payload: {
   *     object: {
   *       id: 'ch_test_123',
   *       amount: 5000,
   *       status: 'paid',
   *     },
   *   },
   * })
   *
   * console.log(result.success) // true if webhook was delivered
   * ```
   */
  async testWebhook(params?: SandboxWebhookTestParams): Promise<{
    success: boolean
    status_code?: number
    error?: string
    event_id: string
    event_type: string
    webhook_url: string
    message: string
  }> {
    return this.client.post('/v1/sandbox/webhooks/test', params)
  }

  /**
   * List available test cards and their behaviors
   *
   * @example
   * ```ts
   * const cards = await vaultix.sandbox.listTestCards()
   *
   * for (const card of cards.data) {
   *   console.log(`${card.number} (${card.brand}): ${card.description}`)
   * }
   * ```
   */
  async listTestCards(): Promise<ListResponse<TestCard> & {
    cvc: string
    expiry: string
  }> {
    return this.client.get('/v1/sandbox/test-cards')
  }
}
