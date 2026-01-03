/**
 * Orders Resource
 *
 * Retrieve and manage orders from your store
 */

import type { VaultixClient } from '../client.js'
import type { ListResponse } from '../types.js'

export interface OrderItem {
  id: string
  object: 'order_item'
  product_id: string
  variant_id?: string
  name: string
  sku?: string
  quantity: number
  unit_price: number
  subtotal: number
  discount?: number
  tax?: number
  total: number
  metadata?: Record<string, any>
}

export interface Order {
  id: string
  object: 'order'
  order_number: string
  status: 'pending' | 'processing' | 'completed' | 'canceled' | 'refunded'
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  fulfillment_status: 'unfulfilled' | 'partial' | 'fulfilled' | 'shipped' | 'delivered'
  customer_id?: string
  seller_id?: string
  billing_address: Record<string, any>
  shipping_address: Record<string, any>
  amounts: {
    subtotal: number
    discount?: number
    shipping?: number
    tax?: number
    total: number
  }
  currency: string
  payment: {
    method?: string
    details?: Record<string, any>
    transaction_id?: string
  }
  shipping: {
    method?: string
    carrier?: string
    tracking_number?: string
    estimated_delivery?: string
    delivered_at?: string
  }
  items?: OrderItem[]
  notes?: {
    customer?: string
    internal?: string
  }
  metadata?: Record<string, any>
  created_at: string
  updated_at?: string
  livemode: boolean
}

export interface OrderListParams {
  limit?: number
  starting_after?: string
  ending_before?: string
  status?: 'pending' | 'processing' | 'completed' | 'canceled' | 'refunded'
  payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
  fulfillment_status?: 'unfulfilled' | 'partial' | 'fulfilled' | 'shipped' | 'delivered'
  customer_id?: string
  created_gte?: string
  created_lte?: string
  expand?: 'items' | string[]
}

export class Orders {
  constructor(private readonly client: VaultixClient) {}

  /**
   * Retrieve an order by ID
   *
   * @example
   * ```ts
   * const order = await vaultix.orders.retrieve('ord_abc123')
   * console.log(order.order_number, order.amounts.total)
   *
   * // With items expanded
   * const orderWithItems = await vaultix.orders.retrieve('ord_abc123', { expand: 'items' })
   * console.log(orderWithItems.items)
   * ```
   */
  async retrieve(id: string, params?: { expand?: 'items' }): Promise<Order> {
    return this.client.get<Order>(`/v1/orders/${id}`, params)
  }

  /**
   * List all orders
   *
   * @example
   * ```ts
   * const orders = await vaultix.orders.list({
   *   limit: 20,
   *   status: 'completed',
   *   payment_status: 'paid',
   * })
   *
   * for (const order of orders.data) {
   *   console.log(order.order_number, order.amounts.total)
   * }
   * ```
   */
  async list(params?: OrderListParams): Promise<ListResponse<Order>> {
    return this.client.get<ListResponse<Order>>('/v1/orders', params)
  }

  /**
   * List items for an order
   *
   * @example
   * ```ts
   * const items = await vaultix.orders.listItems('ord_abc123')
   * for (const item of items.data) {
   *   console.log(item.name, item.quantity, item.total)
   * }
   * ```
   */
  async listItems(orderId: string): Promise<ListResponse<OrderItem>> {
    return this.client.get<ListResponse<OrderItem>>(`/v1/orders/${orderId}/items`)
  }
}
