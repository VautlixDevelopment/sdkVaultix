/**
 * Tokens Resource
 *
 * Tokenize credit card data for secure payments
 */

import type { VaultixClient } from '../client.js'
import type { Token, TokenCreateParams } from '../types.js'

export class Tokens {
  constructor(private readonly client: VaultixClient) {}

  /**
   * Create a card token
   *
   * Tokenize credit card data to use in charges without
   * exposing sensitive card information.
   *
   * @example
   * ```ts
   * const token = await vaultix.tokens.create({
   *   card: {
   *     number: '4242424242424242',
   *     exp_month: 12,
   *     exp_year: 2025,
   *     cvc: '123',
   *     name: 'João Silva',
   *   },
   * })
   *
   * // Use the token to create a charge
   * const charge = await vaultix.charges.create({
   *   amount: 5000,
   *   payment_method: 'credit_card',
   *   card: { token: token.id },
   * })
   * ```
   */
  async create(params: TokenCreateParams): Promise<Token> {
    return this.client.post<Token>('/v1/tokens', params)
  }

  /**
   * Retrieve a token by ID
   *
   * Note: Tokens can only be used once and expire after 15 minutes.
   */
  async retrieve(id: string): Promise<Token> {
    return this.client.get<Token>(`/v1/tokens/${id}`)
  }
}
