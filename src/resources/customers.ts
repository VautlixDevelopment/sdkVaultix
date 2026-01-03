/**
 * Customers Resource
 *
 * Create and manage customers
 */

import type { VaultixClient } from '../client.js'
import type {
  Customer,
  CustomerCreateParams,
  CustomerUpdateParams,
  ListParams,
  ListResponse,
} from '../types.js'

export class Customers {
  constructor(private readonly client: VaultixClient) {}

  /**
   * Create a new customer
   *
   * @example
   * ```ts
   * const customer = await vaultix.customers.create({
   *   name: 'Maria Santos',
   *   email: 'maria@email.com',
   *   document: '12345678900',
   * })
   * ```
   */
  async create(params: CustomerCreateParams): Promise<Customer> {
    return this.client.post<Customer>('/v1/customers', params as Record<string, unknown>)
  }

  /**
   * Retrieve a customer by ID
   */
  async retrieve(id: string): Promise<Customer> {
    return this.client.get<Customer>(`/v1/customers/${id}`)
  }

  /**
   * Update a customer
   *
   * @example
   * ```ts
   * const customer = await vaultix.customers.update('cus_abc123', {
   *   phone: '+5511999999999',
   * })
   * ```
   */
  async update(id: string, params: CustomerUpdateParams): Promise<Customer> {
    return this.client.put<Customer>(`/v1/customers/${id}`, params as Record<string, unknown>)
  }

  /**
   * Delete a customer
   */
  async delete(id: string): Promise<{ id: string; deleted: boolean }> {
    return this.client.delete<{ id: string; deleted: boolean }>(`/v1/customers/${id}`)
  }

  /**
   * List all customers
   */
  async list(params?: ListParams): Promise<ListResponse<Customer>> {
    return this.client.get<ListResponse<Customer>>('/v1/customers', params as Record<string, unknown>)
  }
}
