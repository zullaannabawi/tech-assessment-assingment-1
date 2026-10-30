/**
 * COMPOSITION ROOT — Redux slice: user profile + demo wallet.
 *
 * The wallet balance is the fixed demo value; purchases never deduct it
 * (parity with the original store, where walletBalance never changed).
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from '@/features/user-profile/domain/user'
import type { RootState } from '../index'

export const INITIAL_WALLET_BALANCE = 1050

interface UserState {
  user: User | null
  walletBalance: number
}

const userSlice = createSlice({
  name: 'user',
  initialState: { user: null, walletBalance: INITIAL_WALLET_BALANCE } as UserState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload
    },
  },
})

export const { setUser } = userSlice.actions
export const userReducer = userSlice.reducer

export const selectUser = (state: RootState) => state.user.user
export const selectWalletBalance = (state: RootState) => state.user.walletBalance
