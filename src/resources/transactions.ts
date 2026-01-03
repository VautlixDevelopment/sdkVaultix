/**
 * Transactions Resource
 *
 * Unified transaction history across all payment types
 */

import type { VaultixClient } from '../client.js'
import type { ListResponse } from '../types.js'

export interface Transaction {
  id: string
  object: 'transaction'
  type: 'charge' | 'refund' | 'payout' | 'credit' | 'debit' | 'adjustment'
  status: string
  amount: number
  currency: string
  fee_amount?: number
  net_amount?: number
  converted_amount?: number
  conversion_rate?: number
  payment_method?: string
  source: 'charge' | 'refund' | 'payout' | 'payment' | string
  source_id?: string
  description?: string
  customer_id?: string
  wallet_id?: string
  destination?: Record<string, any>
  metadata?: Record<string, any>
  created_at: string
  updated_at?: string
  livemode: boolean
}

export interface TransactionSummary {
  object: 'transaction_summary'
  period: string
  currency: string
  charges: {
    total_amount: number
    total_count: number
    paid_amount: number
    paid_count: number
    pending_amount: number
    pending_count: number
    failed_count: number
    total_fees: number
  }
  refunds: {
    total_amount: number
    total_count: number
  }
  payouts: {
    total_amount: number
    total_count: number
  }
  net_amount: number
}

export interface TransactionListParams {
  limit?: number
  starting_after?: string
  ending_before?: string
  type?: 'charge' | 'refund' | 'payout'
  status?: string
  payment_method?: string
  source?: 'charge' | 'refund' | 'payout'
  created_gte?: string
  created_lte?: string
  min_amount?: number
  max_amount?: number
}

export class Transactions {
  constructor(private readonly client: VaultixClient) {}

  /**
   * Retrieve a transaction by ID
   *
   * @example
   * ```ts
   * const tx = await vaultix.transactions.retrieve('ch_abc123')
   * console.log(tx.type, tx.amount, tx.status)
   * ```
   */
  async retrieve(id: string): Promise<Transaction> {
    return this.client.get<Transaction>(`/v1/transactions/${id}`)
  }

  /**
   * List all transactions (unified view)
   *
   * @example
   * ```ts
   * const transactions = await vaultix.transactions.list({
   *   limit: 50,
   *   type: 'charge',
   *   created_gte: '2024-01-01T00:00:00Z',
   * })
   *
   * for (const tx of transactions.data) {
   *   console.log(tx.type, tx.amount, tx.status)
   * }
   * ```
   */
  async list(params?: TransactionListParams): Promise<ListResponse<Transaction>> {
    return this.client.get<ListResponse<Transaction>>('/v1/transactions', params as Record<string, unknown>)
  }

  /**
   * Get transaction summary for a period
   *
   * @example
   * ```ts
   * const summary = await vaultix.transactions.summary('30d')
   * console.log('Charges:', summary.charges.paid_amount)
   * console.log('Refunds:', summary.refunds.total_amount)
   * console.log('Net:', summary.net_amount)
   * ```
   */
  async summary(period: '24h' | '7d' | '30d' | '90d' = '30d'): Promise<TransactionSummary> {
    return this.client.get<TransactionSummary>('/v1/transactions/summary', { period })
  }
}
