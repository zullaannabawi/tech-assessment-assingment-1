/**
 * DOMAIN LAYER — Product Catalog Bounded Context
 * Pure TypeScript: the Device model and the catalogue business rules
 * (category filtering, search, sorting). No framework imports allowed.
 */

export const DEVICE_TYPES = ['Smartphones', 'Tablets'] as const
export const CATEGORY_FILTERS = ['All devices', ...DEVICE_TYPES] as const

export type DeviceType = (typeof DEVICE_TYPES)[number]
export type CategoryFilter = (typeof CATEGORY_FILTERS)[number]
export type SortOption = 'featured' | 'low' | 'high'

export type Device = {
  id: string
  name: string
  brand: string
  type: DeviceType
  price: number
  color: string
  tone: string
  tag: string
  storage: string
  screen: string
  chip: string
  camera: string
  battery: string
  os: string
  stock: number
}

export function isCategoryFilter(value: string): value is CategoryFilter {
  return (CATEGORY_FILTERS as readonly string[]).includes(value)
}

/**
 * Keep the devices of the given catalogue category. "All devices" keeps
 * everything, matching the dashboard tabs.
 */
export function filterByCategory(
  devices: Device[],
  category: CategoryFilter
): Device[] {
  if (category === 'All devices') return devices
  return devices.filter((device) => device.type === category)
}

/**
 * Case-insensitive search over the device name and brand, matching the
 * original dashboard behavior: (name + brand).toLowerCase().includes(query).
 */
export function searchDevices(devices: Device[], query: string): Device[] {
  const needle = query.toLowerCase()
  return devices.filter((device) =>
    (device.name + device.brand).toLowerCase().includes(needle)
  )
}

/**
 * Sort devices by price. "featured" preserves the catalogue order and always
 * returns a new array so callers never mutate the source.
 */
export function sortDevices(devices: Device[], sortBy: SortOption): Device[] {
  const list = [...devices]
  if (sortBy === 'low') list.sort((a, b) => a.price - b.price)
  if (sortBy === 'high') list.sort((a, b) => b.price - a.price)
  return list
}
