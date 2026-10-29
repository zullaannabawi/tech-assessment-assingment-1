'use client';
import { configureStore } from '@reduxjs/toolkit';
import { Provider as ReduxProvider } from 'react-redux';
import { useState } from 'react';

// One big reducer, shared between unrelated screens. This is assignment material.
function reducer(state = { user: null, walletBalance: 1050, products: [], selected: null, orders: [] as unknown[], search: '', category: 'All devices' }, action: { type: string; payload?: any }) {
  if (action.type === 'USER') return { ...state, user: action.payload };
  if (action.type === 'PRODUCTS') return { ...state, products: action.payload };
  if (action.type === 'SELECTED') return { ...state, selected: action.payload };
  if (action.type === 'ORDER') return { ...state, orders: [...state.orders, action.payload] };
  if (action.type === 'SEARCH') return { ...state, search: action.payload };
  if (action.type === 'CATEGORY') return { ...state, category: action.payload };
  return state;
}
export default function Provider({ children }: { children: React.ReactNode }) {
  const [store] = useState(() => configureStore({ reducer }));
  return <ReduxProvider store={store}>{children}</ReduxProvider>;
}
