import { ReactNode } from 'react'

/**
 * Centre-screen loading copy. Children carry the exact message text
 * (including the `<span>…</span>` ellipsis used by the dashboard).
 */
export function LoadingIndicator({ children }: { children: ReactNode }) {
  return <div className="loading">{children}</div>
}
