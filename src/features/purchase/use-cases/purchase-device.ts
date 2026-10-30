/**
 * APPLICATION LAYER — Purchase a device.
 *
 * Business rules extracted verbatim from the original inline buy():
 *   1. unknown device  -> DeviceNotFoundError
 *   2. stock < 1       -> OutOfStockError
 *   3. price > balance -> { status: 'insufficient_balance' } (a result)
 *   4. success         -> ORB-XXXXXXXX order reference
 *
 * The 1100ms network simulation lives in the controller, not here, so these
 * rules are testable instantly.
 */

import { DeviceRepository } from '@/features/product-catalog/use-cases/device-repository'
import { DeviceNotFoundError } from '@/features/product-catalog/use-cases/get-device-by-id'
import {
  PurchaseInput,
  PurchaseResult,
  OutOfStockError,
} from '../domain/purchase'

export async function purchaseDevice(
  repo: DeviceRepository,
  input: PurchaseInput
): Promise<PurchaseResult> {
  const device = await repo.getDeviceById(input.deviceId)
  if (!device) {
    throw new DeviceNotFoundError()
  }

  if (device.stock < 1) {
    throw new OutOfStockError()
  }

  if (device.price > input.balance) {
    return { status: 'insufficient_balance' }
  }

  return {
    status: 'success',
    orderId: 'ORB-' + Date.now().toString().slice(-8),
    deviceId: device.id,
    total: device.price,
  }
}
