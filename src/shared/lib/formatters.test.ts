import { describe, it, expect } from 'vitest'
import { formatUsdPrice } from './formatters'

describe('Shared lib: formatUsdPrice', () => {
  it('should format a price below one thousand without separators', () => {
    expect(formatUsdPrice(999)).toBe('$999')
  })

  it('should format a price above one thousand with an en-US grouping separator', () => {
    expect(formatUsdPrice(1050)).toBe('$1,050')
  })

  it('should format higher prices with grouping separators', () => {
    expect(formatUsdPrice(1299)).toBe('$1,299')
  })
})
