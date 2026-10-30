/**
 * COMPOSITION ROOT — Redux store configuration.
 */

import { configureStore } from '@reduxjs/toolkit'
import { userReducer } from './slices/user-slice'
import { deviceCatalogReducer } from './slices/device-catalog-slice'
import { deviceFilterReducer } from './slices/device-filter-slice'
import { ordersReducer } from './slices/orders-slice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    deviceCatalog: deviceCatalogReducer,
    deviceFilter: deviceFilterReducer,
    orders: ordersReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
