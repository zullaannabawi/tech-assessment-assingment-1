interface DeviceArtProps {
  brand: string
  /** Tablets render with a wider illustration frame. */
  isTablet?: boolean
}

/**
 * The pure-CSS device illustration (back panel, cameras, wallpaper).
 * Used inside the card and detail art frames.
 */
export function DeviceArt({ brand, isTablet = false }: DeviceArtProps) {
  return (
    <div className={'device ' + (isTablet ? 'tablet' : '')}>
      <div className="device-back">
        <div className={'cameras ' + (brand === 'Google' ? 'pixel' : '')}><i/><i/><i/></div>
        <span className="device-brand">{brand === 'Apple' ? '●' : brand === 'Google' ? 'G' : 'SAMSUNG'}</span>
      </div>
      <div className="device-front"><div className="dynamic-island"/><div className="wallpaper"/></div>
    </div>
  )
}
