/**
 * Vaultix API Client
 *
 * Core HTTP client for making requests to the Vaultix API
 */

import type { VaultixConfig, VaultixError } from './types.js'

const DEFAULT_BASE_URL = 'https://console.velon.app/api'
const DEFAULT_TIMEOUT = 30000
const DEFAULT_MAX_RETRIES = 3

export class VaultixAPIError extends Error {
  readonly type: VaultixError['type']
  readonly code: string
  readonly param?: string
  readonly docUrl?: string
  readonly statusCode: number

  constructor(error: VaultixError, statusCode: number) {
    super(error.message)
    this.name = 'VaultixAPIError'
    this.type = error.type
    this.code = error.code
    this.param = error.param
    this.docUrl = error.doc_url
    this.statusCode = statusCode
  }
}

export class VaultixClient {
  private readonly secretKey: string
  private readonly baseUrl: string
  private readonly timeout: number
  private readonly maxRetries: number

  constructor(config: VaultixConfig) {
    if (!config.secretKey) {
      throw new Error('Secret key is required')
    }

    if (!config.secretKey.startsWith('sk_')) {
      throw new Error('Invalid secret key format. Must start with sk_live_ or sk_test_')
    }

    this.secretKey = config.secretKey
    this.baseUrl = config.baseUrl || DEFAULT_BASE_URL
    this.timeout = config.timeout || DEFAULT_TIMEOUT
    this.maxRetries = config.maxRetries ?? DEFAULT_MAX_RETRIES
  }

  /**
   * Check if we're in test mode based on the API key
   */
  get isTestMode(): boolean {
    return this.secretKey.startsWith('sk_test_')
  }

  /**
   * Make a request to the Vaultix API
   */
  async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    data?: Record<string, unknown>,
    retryCount = 0
  ): Promise<T> {
    const url = new URL(path, this.baseUrl)

    // Add query params for GET requests
    if (method === 'GET' && data) {
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(url.toString(), {
        method,
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json',
          'User-Agent': '@vaultix/sdk/1.0.0',
        },
        body: method !== 'GET' && data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      const json = await response.json()

      if (!response.ok) {
        // Check if we should retry
        if (this.shouldRetry(response.status, retryCount)) {
          const delay = this.getRetryDelay(retryCount)
          await this.sleep(delay)
          return this.request<T>(method, path, data, retryCount + 1)
        }

        throw new VaultixAPIError(json.error || {
          type: 'api_error',
          code: 'unknown_error',
          message: 'An unknown error occurred',
        }, response.status)
      }

      return json as T
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof VaultixAPIError) {
        throw error
      }

      if (error instanceof Error && error.name === 'AbortError') {
        throw new VaultixAPIError({
          type: 'api_error',
          code: 'timeout',
          message: `Request timed out after ${this.timeout}ms`,
        }, 408)
      }

      // Network error - retry if possible
      if (retryCount < this.maxRetries) {
        const delay = this.getRetryDelay(retryCount)
        await this.sleep(delay)
        return this.request<T>(method, path, data, retryCount + 1)
      }

      throw new VaultixAPIError({
        type: 'api_error',
        code: 'network_error',
        message: error instanceof Error ? error.message : 'Network error',
      }, 0)
    }
  }

  /**
   * GET request helper
   */
  get<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    return this.request<T>('GET', path, params)
  }

  /**
   * POST request helper
   */
  post<T>(path: string, data?: Record<string, unknown>): Promise<T> {
    return this.request<T>('POST', path, data)
  }

  /**
   * PUT request helper
   */
  put<T>(path: string, data?: Record<string, unknown>): Promise<T> {
    return this.request<T>('PUT', path, data)
  }

  /**
   * DELETE request helper
   */
  delete<T>(path: string): Promise<T> {
    return this.request<T>('DELETE', path)
  }

  private shouldRetry(statusCode: number, retryCount: number): boolean {
    if (retryCount >= this.maxRetries) return false

    // Retry on server errors and rate limits
    return statusCode >= 500 || statusCode === 429
  }

  private getRetryDelay(retryCount: number): number {
    // Exponential backoff: 1s, 2s, 4s...
    return Math.min(1000 * Math.pow(2, retryCount), 10000)
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
