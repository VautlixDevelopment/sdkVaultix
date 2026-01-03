/**
 * Refunds Resource
 *
 * Create and manage refunds
 */

import type { VaultixClient } from '../client.js'
import type {
  Refund,
  RefundCreateParams,
  RefundListParams,
  ListResponse,
} from '../types.js'

export class Refunds {
  constructor(private readonly client: VaultixClient) {}

  /**
   * Create a refund for a charge
   *
   * @example
   * ```ts
   * // Full refund
   * const refund = await vaultix.refunds.create({
   *   charge: 'ch_abc123',
   * })
   *
   * // Partial refund
   * const refund = await vaultix.refunds.create({
   *   charge: 'ch_abc123',
   *   amount: 2500, // R$ 25,00
   * })
   * ```
   */
  async create(params: RefundCreateParams): Promise<Refund> {
    return this.client.post<Refund>('/v1/refunds', params)
  }

  /**
   * Retrieve a refund by ID
   */
  async retrieve(id: string): Promise<Refund> {
    return this.client.get<Refund>(`/v1/refunds/${id}`)
  }

  /**
   * List all refunds
   *
   * @example
   * ```ts
   * // List refunds for a specific charge
   * const refunds = await vaultix.refunds.list({
   *   charge: 'ch_abc123',
   * })
   * ```
   */
  async list(params?: RefundListParams): Promise<ListResponse<Refund>> {
    return this.client.get<ListResponse<Refund>>('/v1/refunds', params)
  }
}
