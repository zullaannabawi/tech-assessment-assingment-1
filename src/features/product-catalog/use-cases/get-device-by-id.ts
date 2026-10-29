/**
 * APPLICATION LAYER — Fetch a single device by id.
 */

import { Device } from '../domain/device'
import { DeviceRepository } from './device-repository'

export class DeviceNotFoundError extends Error {
  constructor() {
    // Typographic apostrophe (’) — matches the original UI copy exactly.
    super(`We couldn’t find that device.`)
    this.name = 'DeviceNotFoundError'
  }
}

export async function getDeviceById(
  repo: DeviceRepository,
  id: string
): Promise<Device> {
  const device = await repo.getDeviceById(id)
  if (!device) {
    throw new DeviceNotFoundError()
  }
  return device
}
