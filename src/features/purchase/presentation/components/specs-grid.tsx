import type { LucideIcon } from 'lucide-react'
import { Battery, Camera, Cpu, HardDrive, Monitor, Smartphone } from 'lucide-react'
import { Device } from '@/features/product-catalog/domain/device'

/**
 * Technical specification grid on the detail page.
 */
export function SpecsGrid({ device }: { device: Device }) {
  const rows: [LucideIcon, string, string][] = [
    [Monitor, 'Display', device.screen],
    [Cpu, 'Processor', device.chip],
    [Camera, 'Camera', device.camera],
    [Battery, 'Battery', device.battery],
    [HardDrive, 'Storage', device.storage],
    [Smartphone, 'Operating system', device.os],
  ]

  return (
    <div className="specs">
      {rows.map(([Icon, label, value]) => (
        <div key={label}><Icon size={17}/><span><small>{label}</small><strong>{value}</strong></span></div>
      ))}
    </div>
  )
}
