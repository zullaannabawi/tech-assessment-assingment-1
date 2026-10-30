import { describe, it, expect } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import { User } from '@/features/user-profile/domain/user'
import {
  userReducer,
  setUser,
  selectUser,
  selectWalletBalance,
} from '../slices/user-slice'
import { deviceCatalogReducer } from '../slices/device-catalog-slice'
import { deviceFilterReducer } from '../slices/device-filter-slice'
import { ordersReducer } from '../slices/orders-slice'

const dilan: User = {
  id: 1,
  firstName: 'Dilan',
  lastName: 'Morgan',
  email: 'dilan.1995@email.com',
  membership: 'Orbit Plus',
  walletBalance: 1050,
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

describe('Redux slice: userSlice', () => {
  it('should start with no profile and the fixed demo balance', () => {
    const store = makeStore()
    const state = store.getState()

    expect(state.user.user).toBeNull()
    expect(selectWalletBalance(state)).toBe(1050)
  })

  it('should store the profile via setUser', () => {
    const store = makeStore()
    store.dispatch(setUser(dilan))

    expect(selectUser(store.getState())).toEqual(dilan)
    expect(selectUser(store.getState())?.firstName).toBe('Dilan')
    // The demo balance stays fixed: setUser never touches it.
    expect(selectWalletBalance(store.getState())).toBe(1050)
  })
})
