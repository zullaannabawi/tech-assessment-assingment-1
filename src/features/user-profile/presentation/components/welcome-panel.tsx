import { Sparkles } from 'lucide-react'
import { User } from '../../domain/user'
import { formatUsdPrice } from '@/shared/lib/formatters'

interface WelcomePanelProps {
  user: User | null
  walletBalance: number
}

/**
 * Dashboard welcome strip: profile, membership, and wallet balance. While the
 * profile is still loading, the copy falls back to "Alex" and the preparing
 * text, exactly like the original inline markup.
 */
export function WelcomePanel({ user, walletBalance }: WelcomePanelProps) {
  return (
    <section className="welcome" aria-label="User information">
      <div className="welcome-user">
        <div className="avatar">AM</div>
        <div>
          <div className="welcome-label">YOUR PERSONAL SPACE</div>
          <h2>Welcome back, {user?.firstName || 'Alex'} <span className="wave">✳</span></h2>
          <p>{user?.email || 'Getting your profile ready…'}</p>
        </div>
      </div>
      <div className="member"><span className="plus"><Sparkles size={13}/> {user?.membership || 'Orbit Plus'}</span><p>A little extra, just for you.</p></div>
      <div className="points"><span>YOUR WALLET BALANCE</span><strong>{formatUsdPrice(walletBalance)} <small>USD</small></strong><p>Ready for your next upgrade.</p></div>
    </section>
  )
}
