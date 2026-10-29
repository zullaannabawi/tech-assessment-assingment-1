import { describe, it, expect } from 'vitest'
import { getDevices } from './get-devices'
import { getDeviceById, DeviceNotFoundError } from './get-device-by-id'
import { DeviceRepository } from './device-repository'
import { Device } from '../domain/device'

const catalog: Device[] = [
  {
    id: '1',
    name: 'iPhone 16 Pro',
    brand: 'Apple',
    type: 'Smartphones',
    price: 999,
    color: 'Desert Titanium',
    tone: 'sand',
    tag: 'POPULAR',
    storage: '128 GB',
    screen: '6.3-inch',
    chip: 'A18 Pro',
    camera: '48 MP',
    battery: 'Up to 27 hours',
    os: 'iOS 18',
    stock: 12,
  },
  {
    id: '3',
    name: 'iPad Air',
    brand: 'Apple',
    type: 'Tablets',
    price: 599,
    color: 'Sky Blue',
    tone: 'blue',
    tag: '',
    storage: '128 GB',
    screen: '11-inch',
    chip: 'Apple M3',
    camera: '12 MP',
    battery: 'Up to 10 hours',
    os: 'iPadOS 18',
    stock: 12,
  },
]

class MockDeviceRepository implements DeviceRepository {
  async getDevices(): Promise<Device[]> {
    return catalog
  }

  async getDeviceById(id: string): Promise<Device | null> {
    return catalog.find((device) => device.id === id) ?? null
  }
}

describe('Application: getDevices & getDeviceById use cases', () => {
  const repo = new MockDeviceRepository()

  it('should return all devices from the repository', async () => {
    const result = await getDevices(repo)
    expect(result).toHaveLength(2)
    expect(result[0].name).toBe('iPhone 16 Pro')
  })

  it('should return the device including stock when the id exists', async () => {
    const result = await getDeviceById(repo, '3')
    expect(result.id).toBe('3')
    expect(result.name).toBe('iPad Air')
    expect(result.stock).toBe(12)
  })

  it('should throw DeviceNotFoundError with the exact user-facing message for an unknown id', async () => {
    const unknown = getDeviceById(repo, '99')
    await expect(unknown).rejects.toThrow(DeviceNotFoundError)
    await expect(unknown).rejects.toThrow('We couldn’t find that device.')
  })
})
