/**
 * COMPOSITION ROOT — Redux slice: device catalogue data.
 *
 * Data slice (devices + loading + error) kept separate from the UI filter
 * state in device-filter-slice.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Device } from '@/features/product-catalog/domain/device'
import type { RootState } from '../index'

interface DeviceCatalogState {
  devices: Device[]
  loading: boolean
  error: string
}

const deviceCatalogSlice = createSlice({
  name: 'deviceCatalog',
  initialState: { devices: [], loading: false, error: '' } as DeviceCatalogState,
  reducers: {
    setDevices(state, action: PayloadAction<Device[]>) {
      state.devices = action.payload
    },
    setCatalogLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    },
    setCatalogError(state, action: PayloadAction<string>) {
      state.error = action.payload
    },
  },
})

export const { setDevices, setCatalogLoading, setCatalogError } =
  deviceCatalogSlice.actions
export const deviceCatalogReducer = deviceCatalogSlice.reducer

export const selectDevices = (state: RootState) => state.deviceCatalog.devices
export const selectCatalogLoading = (state: RootState) => state.deviceCatalog.loading
export const selectCatalogError = (state: RootState) => state.deviceCatalog.error
