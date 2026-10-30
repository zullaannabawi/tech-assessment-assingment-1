/**
 * COMPOSITION ROOT — Redux slice: catalogue filter UI state.
 *
 * Pure UI state (search, category, sort) — no business logic, no fetching.
 * `selectFilteredDevices` composes the domain rules over the catalogue data
 * slice, reproducing the original dashboard pipeline:
 * category filter -> search -> sort.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  Device,
  CategoryFilter,
  SortOption,
  filterByCategory,
  searchDevices,
  sortDevices,
} from '@/features/product-catalog/domain/device'
import type { RootState } from '../index'
import { selectDevices } from './device-catalog-slice'

interface DeviceFilterState {
  search: string
  category: CategoryFilter
  sortBy: SortOption
}

const deviceFilterSlice = createSlice({
  name: 'deviceFilter',
  initialState: {
    search: '',
    category: 'All devices',
    sortBy: 'featured',
  } as DeviceFilterState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload
    },
    setCategory(state, action: PayloadAction<CategoryFilter>) {
      state.category = action.payload
    },
    setSortBy(state, action: PayloadAction<SortOption>) {
      state.sortBy = action.payload
    },
  },
})

export const { setSearch, setCategory, setSortBy } = deviceFilterSlice.actions
export const deviceFilterReducer = deviceFilterSlice.reducer

export const selectFilter = (state: RootState) => state.deviceFilter
export const selectSearch = (state: RootState) => state.deviceFilter.search
export const selectCategory = (state: RootState) => state.deviceFilter.category
export const selectSortBy = (state: RootState) => state.deviceFilter.sortBy

export const selectFilteredDevices = (state: RootState): Device[] =>
  sortDevices(
    searchDevices(
      filterByCategory(selectDevices(state), selectCategory(state)),
      selectSearch(state)
    ),
    selectSortBy(state)
  )
