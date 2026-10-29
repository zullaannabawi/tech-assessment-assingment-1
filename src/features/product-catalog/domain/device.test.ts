import { describe, it, expect } from 'vitest'
import {
  Device,
  filterByCategory,
  searchDevices,
  sortDevices,
} from './device'

// Local fixtures keep the domain test free of infrastructure imports.
const fixtures: Device[] = [
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
    id: '2',
    name: 'Galaxy S25 Ultra',
    brand: 'Samsung',
    type: 'Smartphones',
    price: 1299,
    color: 'Titanium Gray',
    tone: 'gray',
    tag: 'NEW ARRIVAL',
    storage: '256 GB',
    screen: '6.9-inch',
    chip: 'Snapdragon 8 Elite',
    camera: '200 MP',
    battery: '5,000 mAh',
    os: 'Android 15',
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

describe('Domain: Device catalogue rules', () => {
  describe('filterByCategory()', () => {
    it('should return only the devices of the given category', () => {
      const result = filterByCategory(fixtures, 'Smartphones')
      expect(result).toHaveLength(2)
      expect(result.every((d) => d.type === 'Smartphones')).toBe(true)
    })

    it('should return every device unchanged for "All devices"', () => {
      const result = filterByCategory(fixtures, 'All devices')
      expect(result).toHaveLength(3)
      expect(result.map((d) => d.id)).toEqual(['1', '2', '3'])
    })
  })

  describe('searchDevices()', () => {
    it('should match the device name case-insensitively', () => {
      const result = searchDevices(fixtures, 'ipHone')
      expect(result.map((d) => d.name)).toEqual(['iPhone 16 Pro'])
    })

    it('should match the brand', () => {
      const result = searchDevices(fixtures, 'sams')
      expect(result.map((d) => d.name)).toEqual(['Galaxy S25 Ultra'])
    })

    it('should return an empty array when nothing matches', () => {
      expect(searchDevices(fixtures, 'zzz')).toEqual([])
    })
  })

  describe('sortDevices()', () => {
    it('should sort by price ascending for "low"', () => {
      const result = sortDevices(fixtures, 'low')
      expect(result.map((d) => d.price)).toEqual([599, 999, 1299])
    })

    it('should sort by price descending for "high"', () => {
      const result = sortDevices(fixtures, 'high')
      expect(result.map((d) => d.price)).toEqual([1299, 999, 599])
    })

    it('should keep the original order for "featured" without mutating the input', () => {
      const input = [...fixtures]
      const result = sortDevices(fixtures, 'featured')
      expect(result.map((d) => d.id)).toEqual(['1', '2', '3'])
      expect(result).not.toBe(fixtures)
      expect(fixtures.map((d) => d.id)).toEqual(input.map((d) => d.id))
    })
  })
})
