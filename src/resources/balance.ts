/**
 * Balance Resource
 *
 * Retrieve account balance and transaction history
 */

import type { VaultixClient } from '../client.js'
import type {
  Balance,
  BalanceTransaction,
  BalanceTransactionListParams,
  ListResponse,
} from '../types.js'

export class BalanceResource {
  constructor(private readonly client: VaultixClient) {}

  /**
   * Retrieve current balance
   *
   * @example
   * ```ts
   * const balance = await vaultix.balance.retrieve()
   *
   * console.log('Available:', balance.available[0].amount / 100)
   * console.log('Pending:', balance.pending[0].amount / 100)
   * ```
   */
  async retrieve(): Promise<Balance> {
    return this.client.get<Balance>('/v1/balance')
  }

  /**
   * List balance transactions (statement)
   *
   * @example
   * ```ts
   * const transactions = await vaultix.balance.listTransactions({
   *   limit: 20,
   *   type: 'charge',
   * })
   *
   * for (const tx of transactions.data) {
   *   console.log(tx.type, tx.amount / 100)
   * }
   * ```
   */
  async listTransactions(params?: BalanceTransactionListParams): Promise<ListResponse<BalanceTransaction>> {
    return this.client.get<ListResponse<BalanceTransaction>>('/v1/balance/transactions', params as Record<string, unknown>)
  }
}
