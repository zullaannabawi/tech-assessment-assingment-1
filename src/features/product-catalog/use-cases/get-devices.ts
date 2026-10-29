/**
 * APPLICATION LAYER — Fetch the device catalogue.
 */

import { Device } from '../domain/device'
import { DeviceRepository } from './device-repository'

export async function getDevices(repo: DeviceRepository): Promise<Device[]> {
  return repo.getDevices()
}
