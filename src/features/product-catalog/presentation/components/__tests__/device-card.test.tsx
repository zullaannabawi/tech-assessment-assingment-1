import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DeviceCard } from '../device-card'
import { Device } from '../../../domain/device'

const iphone: Device = {
  id: '1',
  name: 'iPhone 16 Pro',
  brand: 'Apple',
  type: 'Smartphones',
  price: 999,
  color: 'Desert Titanium',
  tone: 'sand',
  tag: 'POPULAR',
  storage: '128 GB',
  screen: '6.3-inch',
  chip: 'A18 Pro',
  camera: '48 MP',
  battery: 'Up to 27 hours',
  os: 'iOS 18',
  stock: 12,
}

describe('Component: DeviceCard', () => {
  it('should render brand, name, storage+color line, and formatted price', () => {
    render(<DeviceCard device={iphone} />)

    expect(screen.getByText('iPhone 16 Pro')).toBeInTheDocument()
    expect(screen.getByText('Apple')).toBeInTheDocument()
    // storage · color spans several nodes inside one <p>, so match on the paragraph
    expect(
      screen.getByText(
        (_, element) =>
          element?.tagName === 'P' && element.textContent === '128 GB · Desert Titanium'
      )
    ).toBeInTheDocument()
    // the strong holds the price plus the currency small ("$999 USD")
    expect(screen.getByText((_, el) => el?.tagName === 'STRONG' && el.textContent === '$999 USD')).toBeInTheDocument()
    expect(screen.getByText('USD', { selector: 'small' })).toBeInTheDocument()
  })

  it('should link to the product detail route', () => {
    render(<DeviceCard device={iphone} />)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/product/1')
  })

  it('should show the tag badge when the device has one', () => {
    render(<DeviceCard device={iphone} />)
    expect(screen.getByText('POPULAR')).toBeInTheDocument()
  })

  it('should render no badge when the tag is empty', () => {
    render(<DeviceCard device={{ ...iphone, tag: '' }} />)
    expect(screen.queryByText('POPULAR')).not.toBeInTheDocument()
  })
})
