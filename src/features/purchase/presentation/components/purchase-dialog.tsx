'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Check, CircleAlert } from 'lucide-react'
import { Device } from '@/features/product-catalog/domain/device'
import { PurchaseSuccess, PurchaseResult } from '../../domain/purchase'
import { formatUsdPrice } from '@/shared/lib/formatters'

interface PurchaseDialogProps {
  result: PurchaseResult
  device: Device
  balance: number
}

/**
 * Result dialog for a completed purchase attempt: success shows the order
 * reference, insufficient balance shows the shortfall. Focus is moved to the
 * CTA on mount, Tab is trapped inside the dialog, and the previously focused
 * element regains focus when the dialog unmounts — identical to the original.
 */
export function PurchaseDialog({ result, device, balance }: PurchaseDialogProps) {
  const success: PurchaseSuccess | null = result.status === 'success' ? result : null

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    const link = document.getElementById('success-cta')
    link?.focus()
    const trap = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault()
        link?.focus()
      }
    }
    document.addEventListener('keydown', trap)
    return () => {
      document.removeEventListener('keydown', trap)
      previous?.focus()
    }
  }, [])

  return (
    <div className="modal-overlay">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="success-title" aria-describedby="success-description">
        <div className="success-icon">{success ? <Check size={32}/> : <CircleAlert size={32}/>}</div>
        <div className="eyebrow">{success ? 'GOOD THINGS ARE ON THEIR WAY' : 'A LITTLE SHORT THIS TIME'}</div>
        <h2 id="success-title">{success ? 'It’s officially in orbit.' : 'Insufficient balance'}</h2>
        <p id="success-description">{success ? <>Your {device.name} is one step closer to being your new everyday essential.</> : <>Your wallet balance is {formatUsdPrice(balance)} USD. You need {formatUsdPrice(device.price - balance)} USD more to purchase this {device.name}.</>}</p>
        <div className="order-info">
          <span>{success ? 'Order reference' : 'Device price'}</span>
          <strong>{success ? success.orderId : formatUsdPrice(device.price) + ' USD'}</strong>
        </div>
        <Link id="success-cta" className="primary-button" href="/">Back to dashboard <ArrowRight size={18}/></Link>
        <small>This is a simulated purchase. No charge was made.</small>
      </div>
    </div>
  )
}
