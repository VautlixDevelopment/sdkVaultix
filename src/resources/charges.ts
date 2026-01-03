/**
 * Charges Resource
 *
 * Create and manage payment charges (PIX, Card, Boleto)
 */

import type { VaultixClient } from '../client.js'
import type {
  Charge,
  ChargeCreateParams,
  ChargeListParams,
  ListResponse,
} from '../types.js'

export class Charges {
  constructor(private readonly client: VaultixClient) {}

  /**
   * Create a new charge
   *
   * @example
   * ```ts
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
   */
  async create(params: ChargeCreateParams): Promise<Charge> {
    return this.client.post<Charge>('/v1/charges', params)
  }

  /**
   * Retrieve a charge by ID
   *
   * @example
   * ```ts
   * const charge = await vaultix.charges.retrieve('ch_abc123')
   * console.log(charge.status) // 'pending' | 'paid' | ...
   * ```
   */
  async retrieve(id: string): Promise<Charge> {
    return this.client.get<Charge>(`/v1/charges/${id}`)
  }

  /**
   * List all charges
   *
   * @example
   * ```ts
   * const charges = await vaultix.charges.list({
   *   limit: 20,
   *   status: 'paid',
   * })
   *
   * for (const charge of charges.data) {
   *   console.log(charge.id, charge.amount)
   * }
   * ```
   */
  async list(params?: ChargeListParams): Promise<ListResponse<Charge>> {
    return this.client.get<ListResponse<Charge>>('/v1/charges', params)
  }

  /**
   * Capture a pre-authorized card charge
   *
   * @example
   * ```ts
   * const charge = await vaultix.charges.capture('ch_abc123')
   * // Or partial capture:
   * const charge = await vaultix.charges.capture('ch_abc123', { amount: 2500 })
   * ```
   */
  async capture(id: string, params?: { amount?: number }): Promise<Charge> {
    return this.client.post<Charge>(`/v1/charges/${id}/capture`, params)
  }

  /**
   * Cancel a pending or authorized charge
   *
   * @example
   * ```ts
   * const charge = await vaultix.charges.cancel('ch_abc123')
   * console.log(charge.status) // 'canceled'
   * ```
   */
  async cancel(id: string): Promise<Charge> {
    return this.client.post<Charge>(`/v1/charges/${id}/cancel`)
  }
}
