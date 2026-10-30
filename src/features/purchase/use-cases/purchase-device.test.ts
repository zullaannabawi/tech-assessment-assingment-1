import { describe, it, expect } from 'vitest'
import { purchaseDevice } from './purchase-device'
import { PurchaseInput } from '../domain/purchase'
import { DeviceNotFoundError } from '@/features/product-catalog/use-cases/get-device-by-id'
import { OutOfStockError } from '../domain/purchase'
import { Device } from '@/features/product-catalog/domain/device'
import { DeviceRepository } from '@/features/product-catalog/use-cases/device-repository'

const inStock: Device = {
  id: '6',
  name: 'iPhone 16',
  brand: 'Apple',
  type: 'Smartphones',
  price: 799,
  color: 'Ultramarine',
  tone: 'indigo',
  tag: 'GREAT VALUE',
  storage: '128 GB',
  screen: '6.1-inch',
  chip: 'A18',
  camera: '48 MP',
  battery: 'Up to 22 hours',
  os: 'iOS 18',
  stock: 12,
}

const expensive: Device = { ...inStock, id: '2', name: 'Galaxy S25 Ultra', price: 1299 }
const outOfStock: Device = { ...inStock, id: '9', name: 'Sold Out Phone', stock: 0 }

const catalogue: Device[] = [inStock, expensive, outOfStock]

const repo: DeviceRepository = {
  async getDevices() {
    return catalogue
  },
  async getDeviceById(id: string) {
    return catalogue.find((d) => d.id === id) ?? null
  },
}

describe('Application: purchaseDevice use case', () => {
  it('should resolve with an ORB order reference on success', async () => {
    const input: PurchaseInput = { deviceId: '6', balance: 1050 }

    const result = await purchaseDevice(repo, input)

    expect(result.status).toBe('success')
    if (result.status !== 'success') return
    expect(result.orderId).toMatch(/^ORB-\d{8}$/)
    expect(result.deviceId).toBe('6')
    expect(result.total).toBe(799)
  })

  it('should resolve with insufficient_balance when the price exceeds the balance', async () => {
    const input: PurchaseInput = { deviceId: '2', balance: 1050 }

    const result = await purchaseDevice(repo, input)

    expect(result.status).toBe('insufficient_balance')
  })

  it('should reject with OutOfStockError when stock is zero', async () => {
    const input: PurchaseInput = { deviceId: '9', balance: 1050 }

    await expect(purchaseDevice(repo, input)).rejects.toThrow(OutOfStockError)
    await expect(purchaseDevice(repo, input)).rejects.toThrow('This device is out of stock.')
  })

  it('should reject with DeviceNotFoundError for an unknown device', async () => {
    const input: PurchaseInput = { deviceId: '99', balance: 1050 }

    await expect(purchaseDevice(repo, input)).rejects.toThrow(DeviceNotFoundError)
  })

  it('should not carry an order id on an insufficient_balance result', async () => {
    const input: PurchaseInput = { deviceId: '2', balance: 1050 }

    const result = await purchaseDevice(repo, input)

    expect(result).not.toHaveProperty('orderId')
  })
})
