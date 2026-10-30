import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { purchaseDeviceController } from './purchase-controller'
import { PurchaseInput } from '../domain/purchase'

describe('Controller: purchase controller (simulated buy API)', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should resolve a successful purchase after the 1100ms latency', async () => {
    const input: PurchaseInput = { deviceId: '6', balance: 1050 }

    const pending = purchaseDeviceController(input)
    // The buy delay (1100ms) runs concurrently with the repository lookup
    // (600ms), so the result is ready once the longer delay elapses.
    await vi.advanceTimersByTimeAsync(1100)
    const result = await pending

    expect(result.status).toBe('success')
    if (result.status === 'success') {
      expect(result.orderId).toMatch(/^ORB-\d{8}$/)
      expect(result.total).toBe(799)
    }
  })

  it('should resolve insufficient_balance after the latency', async () => {
    const input: PurchaseInput = { deviceId: '2', balance: 1050 }

    const pending = purchaseDeviceController(input)
    await vi.advanceTimersByTimeAsync(1100)

    await expect(pending).resolves.toEqual({ status: 'insufficient_balance' })
  })
})
