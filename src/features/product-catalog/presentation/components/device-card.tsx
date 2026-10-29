import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Device } from '../../domain/device'
import { formatUsdPrice } from '@/shared/lib/formatters'
import { DeviceArt } from './device-art'

/**
 * Catalogue card. The price is formatted in the view via formatUsdPrice
 * instead of storing a priceLabel in state (smell S6).
 */
export function DeviceCard({ device }: { device: Device }) {
  const p = device
  return (
    <Link className="product-card" href={'/product/' + p.id}>
      <div className={'product-art ' + p.tone}>
        {p.tag && <span className={'badge ' + (p.tag === 'NEW ARRIVAL' ? 'green' : '')}>{p.tag}</span>}
        <DeviceArt brand={p.brand} isTablet={p.type === 'Tablets'} />
        <span className="art-caption">{p.color}</span>
      </div>
      <div className="product-copy">
        <span className="brand">{p.brand} <span> / {p.type === 'Tablets' ? 'Tablet' : 'Smartphone'}</span></span>
        <h3>{p.name}</h3>
        <p>{p.storage} <span>·</span> {p.color}</p>
        <div className="product-bottom"><strong>{formatUsdPrice(p.price)}<small> USD</small></strong><span className="circle-arrow"><ArrowUpRight size={19}/></span></div>
      </div>
    </Link>
  )
}
