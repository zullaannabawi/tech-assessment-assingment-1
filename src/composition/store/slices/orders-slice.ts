/**
 * COMPOSITION ROOT — Redux slice: successful purchase history.
 *
 * Parity slice: the original store appended every successful order to
 * `orders` even though no view reads it yet.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PurchaseSuccess } from '@/features/purchase/domain/purchase'
import type { RootState } from '../index'

interface OrdersState {
  orders: PurchaseSuccess[]
}

const ordersSlice = createSlice({
  name: 'orders',
  initialState: { orders: [] } as OrdersState,
  reducers: {
    addOrder(state, action: PayloadAction<PurchaseSuccess>) {
      state.orders.push(action.payload)
    },
  },
})

export const { addOrder } = ordersSlice.actions
export const ordersReducer = ordersSlice.reducer

export const selectOrders = (state: RootState) => state.orders.orders
