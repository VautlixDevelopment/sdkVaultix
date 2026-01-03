/**
 * Payment Links Resource
 *
 * Create and manage payment links
 */

import type { VaultixClient } from '../client.js'
import type {
  PaymentLink,
  PaymentLinkCreateParams,
  PaymentLinkListParams,
  ListResponse,
  Charge,
} from '../types.js'

export class PaymentLinks {
  constructor(private readonly client: VaultixClient) {}

  /**
   * Create a new payment link
   *
   * @example
   * ```ts
   * const link = await vaultix.paymentLinks.create({
   *   amount: 10000, // R$ 100,00
   *   description: 'Product Purchase',
   *   success_url: 'https://mysite.com/success',
   *   payment_methods: ['pix', 'credit_card'],
   * })
   *
   * console.log(link.url) // Share this URL with your customer
   * ```
   */
  async create(params: PaymentLinkCreateParams): Promise<PaymentLink> {
    return this.client.post<PaymentLink>('/v1/payment-links', params as Record<string, unknown>)
  }

  /**
   * Retrieve a payment link by ID
   */
  async retrieve(id: string): Promise<PaymentLink> {
    return this.client.get<PaymentLink>(`/v1/payment-links/${id}`)
  }

  /**
   * List all payment links
   */
  async list(params?: PaymentLinkListParams): Promise<ListResponse<PaymentLink>> {
    return this.client.get<ListResponse<PaymentLink>>('/v1/payment-links', params as Record<string, unknown>)
  }

  /**
   * Deactivate a payment link
   *
   * @example
   * ```ts
   * const link = await vaultix.paymentLinks.deactivate('plink_abc123')
   * console.log(link.status) // 'inactive'
   * ```
   */
  async deactivate(id: string): Promise<PaymentLink> {
    return this.client.post<PaymentLink>(`/v1/payment-links/${id}/deactivate`)
  }

  /**
   * List payments made through a payment link
   *
   * @example
   * ```ts
   * const payments = await vaultix.paymentLinks.listPayments('plink_abc123')
   *
   * for (const payment of payments.data) {
   *   console.log(payment.id, payment.status)
   * }
   * ```
   */
  async listPayments(id: string, params?: { limit?: number }): Promise<ListResponse<Charge>> {
    return this.client.get<ListResponse<Charge>>(`/v1/payment-links/${id}/payments`, params as Record<string, unknown>)
  }
}
