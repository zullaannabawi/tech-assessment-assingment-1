import { describe, it, expect } from 'vitest'
import {
  getDevicesController,
  getDeviceByIdController,
} from './device-controller'
import { DeviceNotFoundError } from '../use-cases/get-device-by-id'

// Controller tests run through the registry, so they also verify the
// composition wiring (InMemory repository + mock catalogue).
describe('Controller: device controller (registry wiring)', () => {
  it('should return the mock catalogue with six stocked devices', async () => {
    const devices = await getDevicesController()

    expect(devices).toHaveLength(6)
    expect(devices[0].name).toBe('iPhone 16 Pro')
    expect(devices.every((d) => d.stock === 12)).toBe(true)
  })

  it('should return the iPad Air for id 3', async () => {
    const device = await getDeviceByIdController('3')

    expect(device.name).toBe('iPad Air')
    expect(device.type).toBe('Tablets')
  })

  it('should reject with DeviceNotFoundError for an unknown id', async () => {
    await expect(getDeviceByIdController('99')).rejects.toThrow(
      DeviceNotFoundError
    )
  })
})
