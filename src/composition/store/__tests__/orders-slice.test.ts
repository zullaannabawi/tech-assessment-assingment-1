import { describe, it, expect } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import { PurchaseSuccess } from '@/features/purchase/domain/purchase'
import {
  ordersReducer,
  addOrder,
  selectOrders,
} from '../slices/orders-slice'
import { userReducer } from '../slices/user-slice'
import { deviceCatalogReducer } from '../slices/device-catalog-slice'
import { deviceFilterReducer } from '../slices/device-filter-slice'

const firstOrder: PurchaseSuccess = {
  status: 'success',
  orderId: 'ORB-12345678',
  deviceId: '6',
  total: 799,
}

const secondOrder: PurchaseSuccess = {
  status: 'success',
  orderId: 'ORB-87654321',
  deviceId: '3',
  total: 599,
}

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

describe('Redux slice: ordersSlice', () => {
  it('should start with no orders', () => {
    const store = makeStore()
    expect(selectOrders(store.getState())).toEqual([])
  })

  it('should append successful purchases via addOrder', () => {
    const store = makeStore()
    store.dispatch(addOrder(firstOrder))
    store.dispatch(addOrder(secondOrder))

    expect(selectOrders(store.getState())).toEqual([firstOrder, secondOrder])
  })
})
