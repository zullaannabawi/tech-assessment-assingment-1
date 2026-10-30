import { describe, it, expect } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import { MOCK_DEVICES } from '@/features/product-catalog/infrastructure/mock-data'
import {
  deviceFilterReducer,
  setSearch,
  setCategory,
  setSortBy,
  selectSearch,
  selectCategory,
  selectSortBy,
  selectFilteredDevices,
} from '../slices/device-filter-slice'
import { deviceCatalogReducer, setDevices } from '../slices/device-catalog-slice'
import { userReducer } from '../slices/user-slice'
import { ordersReducer } from '../slices/orders-slice'

function makeStore(preloadDevices = false) {
  const store = configureStore({
    reducer: {
      user: userReducer,
      deviceCatalog: deviceCatalogReducer,
      deviceFilter: deviceFilterReducer,
      orders: ordersReducer,
    },
  })
  if (preloadDevices) store.dispatch(setDevices(MOCK_DEVICES))
  return store
}

describe('Redux slice: deviceFilterSlice', () => {
  it('should start with the default dashboard filters', () => {
    const store = makeStore()
    const state = store.getState()

    expect(selectSearch(state)).toBe('')
    expect(selectCategory(state)).toBe('All devices')
    expect(selectSortBy(state)).toBe('featured')
  })

  it('should update search, category, and sort', () => {
    const store = makeStore()
    store.dispatch(setSearch('pixel'))
    store.dispatch(setCategory('Tablets'))
    store.dispatch(setSortBy('low'))

    const state = store.getState()
    expect(selectSearch(state)).toBe('pixel')
    expect(selectCategory(state)).toBe('Tablets')
    expect(selectSortBy(state)).toBe('low')
  })

  it('should compose filtering and sorting in selectFilteredDevices', () => {
    const store = makeStore(true)

    let state = store.getState()
    expect(selectFilteredDevices(state)).toHaveLength(6)
    expect(selectFilteredDevices(state).map((d) => d.id)).toEqual([
      '1', '2', '3', '4', '5', '6',
    ])

    store.dispatch(setCategory('Tablets'))
    state = store.getState()
    expect(selectFilteredDevices(state).map((d) => d.type)).toEqual(['Tablets', 'Tablets'])

    store.dispatch(setCategory('All devices'))
    store.dispatch(setSearch('ipHone'))
    state = store.getState()
    expect(selectFilteredDevices(state).map((d) => d.name)).toEqual([
      'iPhone 16 Pro',
      'iPhone 16',
    ])

    store.dispatch(setSearch(''))
    store.dispatch(setSortBy('low'))
    state = store.getState()
    expect(selectFilteredDevices(state).map((d) => d.price)).toEqual([
      599, 799, 999, 999, 999, 1299,
    ])
  })

  it('should combine category, search, and sort at once', () => {
    const store = makeStore(true)
    store.dispatch(setSearch('apple'))
    store.dispatch(setCategory('Smartphones'))
    store.dispatch(setSortBy('low'))

    const devices = selectFilteredDevices(store.getState())
    expect(devices.map((d) => d.name)).toEqual(['iPhone 16', 'iPhone 16 Pro'])
  })

  it('should return an empty list when nothing matches', () => {
    const store = makeStore(true)
    store.dispatch(setSearch('zzz'))

    expect(selectFilteredDevices(store.getState())).toEqual([])
  })
})
