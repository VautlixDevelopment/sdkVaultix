/**
 * Products Resource
 *
 * Create and manage products in your catalog
 */

import type { VaultixClient } from '../client.js'
import type { ListResponse } from '../types.js'

export interface Product {
  id: string
  object: 'product'
  name: string
  description?: string
  short_description?: string
  slug: string
  sku?: string
  barcode?: string
  price: number
  compare_price?: number
  cost_price?: number
  currency: string
  stock_quantity: number
  stock_status: 'in_stock' | 'out_of_stock' | 'low_stock'
  track_inventory: boolean
  status: 'active' | 'draft' | 'archived' | 'deleted'
  visibility: 'visible' | 'hidden'
  is_active: boolean
  is_featured: boolean
  is_digital: boolean
  featured_image?: string
  images?: string[]
  gallery_urls?: string[]
  has_variants: boolean
  variant_options?: Record<string, any>
  category_id?: string
  tags?: string[]
  attributes?: Record<string, any>
  weight?: number
  weight_unit?: string
  dimensions?: {
    length?: number
    width?: number
    height?: number
    unit?: string
  }
  meta?: {
    title?: string
    description?: string
    keywords?: string[]
  }
  stats?: {
    view_count?: number
    sale_count?: number
    rating_average?: number
    rating_count?: number
  }
  metadata?: Record<string, any>
  created_at: string
  updated_at?: string
  published_at?: string
  livemode: boolean
}

export interface ProductCreateParams {
  name: string
  description?: string
  short_description?: string
  sku?: string
  barcode?: string
  price: number
  compare_price?: number
  cost_price?: number
  stock_quantity?: number
  track_inventory?: boolean
  status?: 'active' | 'draft' | 'archived'
  visibility?: 'visible' | 'hidden'
  is_featured?: boolean
  is_digital?: boolean
  featured_image?: string
  images?: string[]
  category_id?: string
  tags?: string[]
  attributes?: Record<string, any>
  weight?: number
  weight_unit?: string
  length?: number
  width?: number
  height?: number
  dimension_unit?: string
  meta_title?: string
  meta_description?: string
  meta_keywords?: string[]
  metadata?: Record<string, any>
}

export interface ProductUpdateParams extends Partial<ProductCreateParams> {}

export interface ProductListParams {
  limit?: number
  starting_after?: string
  ending_before?: string
  status?: 'active' | 'draft' | 'archived'
  category_id?: string
  is_active?: boolean
  is_featured?: boolean
  search?: string
}

export class Products {
  constructor(private readonly client: VaultixClient) {}

  /**
   * Create a new product
   *
   * @example
   * ```ts
   * const product = await vaultix.products.create({
   *   name: 'Camiseta Básica',
   *   price: 4990, // R$ 49,90
   *   stock_quantity: 100,
   * })
   * ```
   */
  async create(params: ProductCreateParams): Promise<Product> {
    return this.client.post<Product>('/v1/products', params)
  }

  /**
   * Retrieve a product by ID
   *
   * @example
   * ```ts
   * const product = await vaultix.products.retrieve('prod_abc123')
   * console.log(product.name, product.price)
   * ```
   */
  async retrieve(id: string): Promise<Product> {
    return this.client.get<Product>(`/v1/products/${id}`)
  }

  /**
   * List all products
   *
   * @example
   * ```ts
   * const products = await vaultix.products.list({
   *   limit: 20,
   *   status: 'active',
   * })
   *
   * for (const product of products.data) {
   *   console.log(product.name, product.price)
   * }
   * ```
   */
  async list(params?: ProductListParams): Promise<ListResponse<Product>> {
    return this.client.get<ListResponse<Product>>('/v1/products', params)
  }

  /**
   * Update a product
   *
   * @example
   * ```ts
   * const product = await vaultix.products.update('prod_abc123', {
   *   price: 5990,
   *   stock_quantity: 50,
   * })
   * ```
   */
  async update(id: string, params: ProductUpdateParams): Promise<Product> {
    return this.client.put<Product>(`/v1/products/${id}`, params)
  }

  /**
   * Delete a product
   *
   * @example
   * ```ts
   * const result = await vaultix.products.delete('prod_abc123')
   * console.log(result.deleted) // true
   * ```
   */
  async delete(id: string): Promise<{ id: string; object: 'product'; deleted: boolean }> {
    return this.client.delete<{ id: string; object: 'product'; deleted: boolean }>(`/v1/products/${id}`)
  }
}
