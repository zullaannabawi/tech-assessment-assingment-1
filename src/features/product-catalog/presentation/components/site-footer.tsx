import Link from 'next/link'
import { ArrowRight, CircleHelp } from 'lucide-react'

interface SiteFooterProps {
  /** The dashboard footer decorates its end note with icons; the detail footer is plain text. */
  decorated?: boolean
}

/**
 * Shared site footer. Both variants were previously inlined per page.
 */
export function SiteFooter({ decorated = false }: SiteFooterProps) {
  return (
    <footer>
      <Link href="/" className="logo">◉ orbit.</Link>
      <span>A better everyday starts here.</span>
      {decorated ? (
        <span className="footer-end"><CircleHelp size={14}/> A demo store, made for learning. <ArrowRight size={14}/></span>
      ) : (
        <span className="footer-end">A demo store, made for learning.</span>
      )}
    </footer>
  )
}
