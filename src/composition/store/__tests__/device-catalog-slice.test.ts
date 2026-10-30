import { describe, it, expect } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import { MOCK_DEVICES } from '@/features/product-catalog/infrastructure/mock-data'
import {
  deviceCatalogReducer,
  setDevices,
  setCatalogLoading,
  setCatalogError,
  selectDevices,
  selectCatalogLoading,
  selectCatalogError,
} from '../slices/device-catalog-slice'
import { userReducer } from '../slices/user-slice'
import { deviceFilterReducer } from '../slices/device-filter-slice'
import { ordersReducer } from '../slices/orders-slice'

function makeStore() {
  return configureStore({
    reducer: {
      user: userReducer,
      deviceCatalog: deviceCatalogReducer,
      deviceFilter: deviceFilterReducer,
      orders: ordersReducer,
    },
  })
}

describe('Redux slice: deviceCatalogSlice', () => {
  it('should start empty and loading', () => {
    const store = makeStore()
    const state = store.getState()

    expect(selectDevices(state)).toEqual([])
    expect(selectCatalogLoading(state)).toBe(true)
    expect(selectCatalogError(state)).toBe('')
  })

  it('should store the catalogue via setDevices', () => {
    const store = makeStore()
    store.dispatch(setDevices(MOCK_DEVICES))

    expect(selectDevices(store.getState())).toHaveLength(6)
  })

  it('should track loading and error states independently', () => {
    const store = makeStore()
    store.dispatch(setCatalogLoading(true))
    expect(selectCatalogLoading(store.getState())).toBe(true)

    store.dispatch(setCatalogError('Something went wrong. Please refresh to try again.'))
    expect(selectCatalogError(store.getState())).toBe(
      'Something went wrong. Please refresh to try again.'
    )

    store.dispatch(setCatalogLoading(false))
    expect(selectCatalogLoading(store.getState())).toBe(false)
  })
})
