'use client'

/**
 * PRESENTATION LAYER — Product detail page.
 *
 * Local state follows the original page (device/busy/done/error/loading);
 * the dead SELECTED dispatch is gone (analysis S7) and successful purchases
 * are recorded via addOrder (parity with the old ORDER action).
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Check, ShieldCheck, Truck } from 'lucide-react'
import { Device } from '../../domain/device'
import { getDeviceByIdController } from '../../controllers/device-controller'
import { purchaseDeviceController } from '@/features/purchase/controllers/purchase-controller'
import { PurchaseResult } from '@/features/purchase/domain/purchase'
import { useAppDispatch, useAppSelector } from '@/composition/store/hooks'
import { selectWalletBalance } from '@/composition/store/slices/user-slice'
import { addOrder } from '@/composition/store/slices/orders-slice'
import { SiteHeader } from '../components/site-header'
import { SiteFooter } from '../components/site-footer'
import { DeviceArt } from '../components/device-art'
import { LoadingIndicator } from '../components/loading-indicator'
import { SpecsGrid } from '@/features/purchase/presentation/components/specs-grid'
import { BuyButton } from '@/features/purchase/presentation/components/buy-button'
import { PurchaseDialog } from '@/features/purchase/presentation/components/purchase-dialog'
import { formatUsdPrice } from '@/shared/lib/formatters'

export function ProductDetailPage({ id }: { id: string }) {
  const dispatch = useAppDispatch()
  const balance = useAppSelector(selectWalletBalance)
  const [device, setDevice] = useState<Device | null>(null)
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState<PurchaseResult | null>(null)
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    getDeviceByIdController(id)
      .then((data) => {
        if (mounted) setDevice(data)
      })
      .catch((e: unknown) => {
        if (mounted) setErr(e instanceof Error ? e.message : 'We couldn’t find that device.')
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [id])

  async function buy() {
    if (busy || done) return
    setBusy(true)
    setErr('')
    try {
      const result = await purchaseDeviceController({ deviceId: id, balance })
      if (result.status === 'success') dispatch(addOrder(result))
      setDone(result)
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Purchase failed. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="detail-main">
        <Link className="back-link" href="/"><ArrowLeft size={16}/> Back to discover</Link>
        {loading ? (
          <LoadingIndicator>A closer look is on its way…</LoadingIndicator>
        ) : !device ? (
          <div className="empty">
            <h1>Device not found.</h1>
            <p role="alert">{err}</p>
            <Link className="primary-button" href="/">Back to dashboard <ArrowRight size={17}/></Link>
          </div>
        ) : (
          <div className="detail-grid">
            <div>
              <div className={'detail-art product-art ' + device.tone}>
                <span className="badge">THE EVERYDAY, REIMAGINED</span>
                <DeviceArt brand={device.brand} isTablet={device.type === 'Tablets'} />
                <span className="art-caption">Designed for your everyday.</span>
              </div>
              <p className="illustration-note">Illustrative device preview. Specifications are demo data.</p>
            </div>
            <div className="detail-copy">
              <div className="eyebrow">{device.brand} / {device.type}</div>
              <h1>{device.name}</h1>
              <p className="description">A little more possibility in your hands. Beautifully designed, effortlessly powerful, and ready for whatever your day brings.</p>
              <div className="detail-price">{formatUsdPrice(device.price)} <span>USD · One-time payment</span></div>
              <div className="divider"/>
              <div className="option-label">COLOR <strong>{device.color}</strong></div>
              <div className={'color-swatch ' + device.tone}><Check size={16}/></div>
              <div className="option-label">STORAGE</div>
              <div className="storage-option">{device.storage}<Check size={15}/></div>
              <h2 className="spec-heading">Small details. Big difference.</h2>
              <SpecsGrid device={device} />
              <div className="in-stock"><span/> In stock. Ready for your next chapter.</div>
              {err && <p role="alert" className="error">{err}</p>}
              <BuyButton price={device.price} busy={busy} disabled={busy || !!done} onBuy={buy} />
              <p className="purchase-note">Demo purchase · No payment or personal details needed</p>
              <div className="detail-perks"><span><Truck size={16}/> Free shipping</span><span><ShieldCheck size={16}/> 1-year warranty</span></div>
            </div>
          </div>
        )}
      </main>
      <SiteFooter />
      {done && device && <PurchaseDialog result={done} device={device} balance={balance} />}
    </>
  )
}
