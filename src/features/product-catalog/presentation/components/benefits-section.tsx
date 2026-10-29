import { Package, ShieldCheck, Truck } from 'lucide-react'

/**
 * Shipping / warranty / returns strip under the catalogue.
 */
export function BenefitsSection() {
  return (
    <section className="benefits">
      <div><Truck/><span><strong>On its way, on us.</strong><small>Free shipping on every device</small></span></div>
      <div><ShieldCheck/><span><strong>Peace of mind included.</strong><small>1-year warranty on all devices</small></span></div>
      <div><Package/><span><strong>Find your perfect fit.</strong><small>Easy returns within 14 days</small></span></div>
    </section>
  )
}
