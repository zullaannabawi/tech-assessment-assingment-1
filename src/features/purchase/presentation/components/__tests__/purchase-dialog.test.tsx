import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PurchaseDialog } from '../purchase-dialog'
import { Device } from '@/features/product-catalog/domain/device'
import { PurchaseSuccess } from '../../../domain/purchase'

const galaxy: Device = {
  id: '2',
  name: 'Galaxy S25 Ultra',
  brand: 'Samsung',
  type: 'Smartphones',
  price: 1299,
  color: 'Titanium Gray',
  tone: 'gray',
  tag: 'NEW ARRIVAL',
  storage: '256 GB',
  screen: '6.9-inch',
  chip: 'Snapdragon 8 Elite',
  camera: '200 MP',
  battery: '5,000 mAh',
  os: 'Android 15',
  stock: 12,
}

const success: PurchaseSuccess = {
  status: 'success',
  orderId: 'ORB-12345678',
  deviceId: '2',
  total: 1299,
}

describe('Component: PurchaseDialog', () => {
  it('should render the success variant with the order reference', () => {
    render(<PurchaseDialog result={success} device={galaxy} balance={1050} />)

    expect(screen.getByText('It’s officially in orbit.')).toBeInTheDocument()
    expect(screen.getByText('ORB-12345678')).toBeInTheDocument()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('should render the insufficient variant with balance and shortfall', () => {
    render(
      <PurchaseDialog result={{ status: 'insufficient_balance' }} device={galaxy} balance={1050} />
    )

    expect(screen.getByText('Insufficient balance')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Your wallet balance is $1,050 USD. You need $249 USD more to purchase this Galaxy S25 Ultra.'
      )
    ).toBeInTheDocument()
    expect(screen.getByText('$1,299 USD')).toBeInTheDocument()
  })

  it('should move focus to the dialog CTA on mount', () => {
    render(<PurchaseDialog result={success} device={galaxy} balance={1050} />)

    expect(screen.getByText('Back to dashboard')).toHaveFocus()
  })
})
