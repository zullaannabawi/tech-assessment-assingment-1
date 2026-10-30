'use client'

/**
 * COMPOSITION ROOT — Redux Provider.
 *
 * Client wrapper required by the App Router: the root layout is a Server
 * Component while the Redux store must be provided on the client. Unlike the
 * old provider, the store is a module singleton and fully typed.
 */

import { Provider } from 'react-redux'
import { store } from './index'

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>
}
