/**
 * Payouts Resource
 *
 * Create and manage payouts (withdrawals)
 */

import type { VaultixClient } from '../client.js'
import type {
  Payout,
  PayoutCreateParams,
  PayoutListParams,
  ListResponse,
} from '../types.js'

export class Payouts {
  constructor(private readonly client: VaultixClient) {}

  /**
   * Create a new payout (withdrawal)
   *
   * @example
   * ```ts
   * // PIX payout
   * const payout = await vaultix.payouts.create({
   *   amount: 50000, // R$ 500,00
   *   destination: {
   *     pix_key: 'email@example.com',
   *     holder_name: 'João Silva',
   *   },
   * })
   *
   * // Bank transfer payout
   * const payout = await vaultix.payouts.create({
   *   amount: 100000, // R$ 1.000,00
   *   destination: {
   *     bank_code: '001',
   *     branch: '1234',
   *     account: '12345-6',
   *     account_type: 'checking',
   *     holder_name: 'João Silva',
   *     holder_document: '12345678900',
   *   },
   * })
   * ```
   */
  async create(params: PayoutCreateParams): Promise<Payout> {
    return this.client.post<Payout>('/v1/payouts', params)
  }

  /**
   * Retrieve a payout by ID
   */
  async retrieve(id: string): Promise<Payout> {
    return this.client.get<Payout>(`/v1/payouts/${id}`)
  }

  /**
   * List all payouts
   *
   * @example
   * ```ts
   * const payouts = await vaultix.payouts.list({
   *   status: 'paid',
   *   limit: 20,
   * })
   * ```
   */
  async list(params?: PayoutListParams): Promise<ListResponse<Payout>> {
    return this.client.get<ListResponse<Payout>>('/v1/payouts', params)
  }

  /**
   * Cancel a pending payout
   *
   * Only pending payouts can be canceled.
   *
   * @example
   * ```ts
   * const payout = await vaultix.payouts.cancel('po_abc123')
   * console.log(payout.status) // 'canceled'
   * ```
   */
  async cancel(id: string): Promise<Payout> {
    return this.client.post<Payout>(`/v1/payouts/${id}/cancel`)
  }
}
