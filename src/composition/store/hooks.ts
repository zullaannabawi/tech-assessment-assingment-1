/**
 * COMPOSITION ROOT — Typed Redux hooks.
 *
 * Use these in all client components instead of the untyped
 * useSelector/useDispatch from react-redux.
 */

import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './index'

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
