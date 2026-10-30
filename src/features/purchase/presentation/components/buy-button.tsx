'use client'

import { ArrowRight, LoaderCircle } from 'lucide-react'
import { formatUsdPrice } from '@/shared/lib/formatters'

interface BuyButtonProps {
  price: number
  busy: boolean
  /** Disabled while busy or once a result dialog is open — prevents duplicate submissions. */
  disabled: boolean
  onBuy: () => void
}

/**
 * The purchase CTA. The page owns the busy/done state; this component only
 * renders it (spinner + copy swap) exactly like the original inline button.
 */
export function BuyButton({ price, busy, disabled, onBuy }: BuyButtonProps) {
  return (
    <button className="primary-button buy" disabled={disabled} onClick={onBuy}>
      {busy ? (
        <><LoaderCircle className="spin" size={18}/> Making it yours…</>
      ) : (
        <>Make it yours <span>{formatUsdPrice(price)} <ArrowRight size={18}/></span></>
      )}
    </button>
  )
}
