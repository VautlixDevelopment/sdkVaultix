/**
 * Vaultix SDK Types
 */

// ============================================
// CONFIGURATION
// ============================================

export interface VaultixConfig {
  /** Secret API key (sk_live_... or sk_test_...) */
  secretKey: string
  /** API base URL (defaults to production) */
  baseUrl?: string
  /** Request timeout in milliseconds */
  timeout?: number
  /** Maximum retry attempts for failed requests */
  maxRetries?: number
}

// ============================================
// COMMON TYPES
// ============================================

export interface VaultixError {
  type: 'api_error' | 'authentication_error' | 'invalid_request_error' | 'rate_limit_error'
  code: string
  message: string
  param?: string
  doc_url?: string
}

export interface ListParams {
  /** Number of items to return (max 100) */
  limit?: number
  /** Cursor for pagination */
  starting_after?: string
}

export interface ListResponse<T> {
  object: 'list'
  data: T[]
  has_more: boolean
  total_count?: number
}

export type Currency = 'BRL' | 'USD' | 'EUR'
export type PaymentMethod = 'pix' | 'credit_card' | 'boleto'
export type Environment = 'live' | 'test'

// ============================================
// CHARGES
// ============================================

export interface ChargeCreateParams {
  /** Amount in cents (minimum 100 = R$ 1,00) */
  amount: number
  /** Currency code */
  currency?: Currency
  /** Payment method */
  payment_method: PaymentMethod
  /** Customer information */
  customer?: {
    id?: string
    name?: string
    email?: string
    document?: string
    phone?: string
  }
  /** Description for the charge */
  description?: string
  /** Additional metadata */
  metadata?: Record<string, unknown>
  /** Card payment options */
  card?: {
    token: string
    installments?: number
    capture?: boolean
  }
  /** Boleto options */
  boleto?: {
    due_date?: string
    instructions?: string
  }
}

export interface Charge {
  id: string
  object: 'charge'
  amount: number
  currency: Currency
  payment_method: PaymentMethod
  status: 'pending' | 'authorized' | 'paid' | 'failed' | 'canceled' | 'refunded' | 'expired'
  description?: string
  metadata?: Record<string, unknown>
  created: string
  livemode: boolean
  pix?: {
    qr_code: string
    qr_code_url?: string
    expires_at: string
  }
  card?: {
    brand: string
    last4: string
    exp_month?: number
    exp_year?: number
  }
  boleto?: {
    barcode: string
    barcode_url?: string
    pdf_url?: string
    due_date: string
  }
}

export interface ChargeListParams extends ListParams {
  status?: Charge['status']
  payment_method?: PaymentMethod
}

// ============================================
// CUSTOMERS
// ============================================

export interface CustomerCreateParams {
  name: string
  email: string
  document?: string
  phone?: string
  address?: {
    line1?: string
    line2?: string
    city?: string
    state?: string
    postal_code?: string
    country?: string
  }
  metadata?: Record<string, unknown>
}

export interface CustomerUpdateParams extends Partial<CustomerCreateParams> {}

export interface Customer {
  id: string
  object: 'customer'
  name: string
  email: string
  document?: string
  phone?: string
  address?: {
    line1?: string
    line2?: string
    city?: string
    state?: string
    postal_code?: string
    country?: string
  }
  metadata?: Record<string, unknown>
  created: string
  livemode: boolean
}

// ============================================
// TOKENS
// ============================================

export interface TokenCreateParams {
  card: {
    number: string
    exp_month: number
    exp_year: number
    cvc: string
    name?: string
  }
}

export interface Token {
  id: string
  object: 'token'
  card: {
    brand: string
    last4: string
    exp_month: number
    exp_year: number
    name?: string
  }
  created: string
  livemode: boolean
  used: boolean
}

// ============================================
// REFUNDS
// ============================================

export interface RefundCreateParams {
  /** Charge ID to refund */
  charge: string
  /** Amount to refund in cents (optional, defaults to full amount) */
  amount?: number
  /** Reason for refund */
  reason?: 'requested_by_customer' | 'duplicate' | 'fraudulent'
}

export interface Refund {
  id: string
  object: 'refund'
  amount: number
  charge: string
  status: 'pending' | 'succeeded' | 'failed'
  reason?: string
  created: string
  livemode: boolean
}

export interface RefundListParams extends ListParams {
  charge?: string
}

// ============================================
// BALANCE
// ============================================

export interface Balance {
  object: 'balance'
  available: Array<{
    amount: number
    currency: Currency
  }>
  pending: Array<{
    amount: number
    currency: Currency
  }>
  livemode: boolean
}

export interface BalanceTransaction {
  id: string
  object: 'balance_transaction'
  amount: number
  type: 'charge' | 'refund' | 'payout' | 'adjustment'
  source: string
  description?: string
  created: string
  status: 'available' | 'pending'
}

export interface BalanceTransactionListParams extends ListParams {
  type?: BalanceTransaction['type']
}

// ============================================
// PAYMENT LINKS
// ============================================

export interface PaymentLinkCreateParams {
  /** Amount in cents */
  amount: number
  /** Currency code */
  currency?: Currency
  /** Description */
  description?: string
  /** Allowed payment methods */
  payment_methods?: PaymentMethod[]
  /** URL to redirect after successful payment */
  success_url?: string
  /** URL to redirect if payment is canceled */
  cancel_url?: string
  /** Expiration date */
  expires_at?: string
  /** Maximum number of uses */
  max_uses?: number
  /** Pre-fill customer email */
  customer_email?: string
  /** Whether to collect customer info */
  collect_customer_info?: boolean
  /** Additional metadata */
  metadata?: Record<string, unknown>
}

export interface PaymentLink {
  id: string
  object: 'payment_link'
  url: string
  short_code: string
  amount: number
  currency: Currency
  description?: string
  payment_methods: PaymentMethod[]
  success_url?: string
  cancel_url?: string
  expires_at?: string
  max_uses?: number
  current_uses: number
  metadata?: Record<string, unknown>
  status: 'active' | 'inactive' | 'expired'
  created: string
  livemode: boolean
}

export interface PaymentLinkListParams extends ListParams {
  status?: PaymentLink['status']
}

// ============================================
// PAYOUTS
// ============================================

export interface PayoutCreateParams {
  /** Amount in cents */
  amount: number
  /** Currency code */
  currency?: Currency
  /** Destination for the payout */
  destination: {
    pix_key?: string
    bank_code?: string
    branch?: string
    account?: string
    account_type?: 'checking' | 'savings'
    holder_name?: string
    holder_document?: string
  }
  /** Description */
  description?: string
  /** Additional metadata */
  metadata?: Record<string, unknown>
}

export interface Payout {
  id: string
  object: 'payout'
  amount: number
  currency: Currency
  destination: {
    type: 'pix' | 'bank_account'
    pix_key?: string
    bank_code?: string
    branch?: string
    account?: string
    holder_name?: string
  }
  description?: string
  metadata?: Record<string, unknown>
  status: 'pending' | 'in_transit' | 'paid' | 'failed' | 'canceled'
  estimated_arrival?: string
  arrival_date?: string
  failure_code?: string
  failure_message?: string
  created: string
  livemode: boolean
}

export interface PayoutListParams extends ListParams {
  status?: Payout['status']
}

// ============================================
// SANDBOX
// ============================================

export interface SandboxChargePayParams {
  // No additional params needed
}

export interface SandboxChargeFailParams {
  failure_code?: string
  failure_message?: string
}

export interface SandboxWebhookTestParams {
  event_type?: string
  payload?: Record<string, unknown>
}

export interface TestCard {
  number: string
  brand: string
  behavior: string
  description: string
}
