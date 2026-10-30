/**
 * CONTROLLER LAYER — Purchase entry point.
 *
 * Simulates the original buy POST: the 1100ms network latency runs
 * concurrently with the use case (which itself resolves the device through
 * the repository's 600ms lookup), keeping the end-to-end wait at ~1100ms —
 * exactly like the inline `buy()` before the refactor.
 */

import { createDeviceRepository } from '@/composition/registry'
import { purchaseDevice } from '../use-cases/purchase-device'
import { PurchaseInput, PurchaseResult } from '../domain/purchase'

const PURCHASE_DELAY_MS = 1100

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function purchaseDeviceController(
  input: PurchaseInput
): Promise<PurchaseResult> {
  const repo = createDeviceRepository()
  const [, result] = await Promise.all([
    delay(PURCHASE_DELAY_MS),
    purchaseDevice(repo, input),
  ])
  return result
}
