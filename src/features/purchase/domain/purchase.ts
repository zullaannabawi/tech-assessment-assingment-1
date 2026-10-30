/**
 * DOMAIN LAYER — Purchase Bounded Context
 * Pure TypeScript: purchase contract and domain errors.
 *
 * Parity note: an insufficient wallet balance is a RESULT, not an error —
 * the original simulated buy API resolved with `{ status: 'insufficient_balance' }`
 * so the UI could show a dedicated dialog. Only true failures (unknown device,
 * out of stock) throw.
 */

export type PurchaseInput = {
  deviceId: string
  balance: number
}

export type PurchaseSuccess = {
  status: 'success'
  orderId: string
  deviceId: string
  total: number
}

export type PurchaseResult = PurchaseSuccess | { status: 'insufficient_balance' }

export class OutOfStockError extends Error {
  constructor() {
    super('This device is out of stock.')
    this.name = 'OutOfStockError'
  }
}
