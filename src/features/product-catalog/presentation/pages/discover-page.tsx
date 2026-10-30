'use client'

/**
 * PRESENTATION LAYER — Discover page (dashboard).
 *
 * Composition of the decomposed catalogue components. The only logic here is
 * orchestration: load the profile and catalogue through the controllers on
 * mount, read the filtered list from the store, and pass everything down.
 */

import { useEffect } from 'react'
import { getUserController } from '@/features/user-profile/controllers/user-controller'
import { useAppDispatch, useAppSelector } from '@/composition/store/hooks'
import { setUser, selectUser, selectWalletBalance } from '@/composition/store/slices/user-slice'
import {
  setDevices,
  setCatalogLoading,
  setCatalogError,
  selectCatalogLoading,
  selectCatalogError,
} from '@/composition/store/slices/device-catalog-slice'
import {
  setSearch,
  setCategory,
  setSortBy,
  selectSearch,
  selectCategory,
  selectSortBy,
  selectFilteredDevices,
} from '@/composition/store/slices/device-filter-slice'
import { SiteHeader } from '../components/site-header'
import { SiteFooter } from '../components/site-footer'
import { WelcomePanel } from '@/features/user-profile/presentation/components/welcome-panel'
import { CollectionHeading } from '../components/collection-heading'
import { FilterToolbar } from '../components/filter-toolbar'
import { DeviceCard } from '../components/device-card'
import { BenefitsSection } from '../components/benefits-section'
import { LoadingIndicator } from '../components/loading-indicator'
import { getDevicesController } from '../../controllers/device-controller'

export function DiscoverPage() {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectUser)
  const walletBalance = useAppSelector(selectWalletBalance)
  const search = useAppSelector(selectSearch)
  const category = useAppSelector(selectCategory)
  const sortBy = useAppSelector(selectSortBy)
  const list = useAppSelector(selectFilteredDevices)
  const loading = useAppSelector(selectCatalogLoading)
  const error = useAppSelector(selectCatalogError)

  useEffect(() => {
    let alive = true
    Promise.all([
      getUserController().then((u) => {
        if (alive) dispatch(setUser(u))
      }),
      getDevicesController().then((d) => {
        if (alive) dispatch(setDevices(d))
      }),
    ])
      .catch(() => {
        if (alive) dispatch(setCatalogError('Something went wrong. Please refresh to try again.'))
      })
      .finally(() => {
        if (alive) dispatch(setCatalogLoading(false))
      })
    return () => {
      alive = false
    }
  }, [dispatch])

  return (
    <>
      <SiteHeader />
      <main>
        <WelcomePanel user={user} walletBalance={walletBalance} />
        <CollectionHeading />
        <FilterToolbar
          category={category}
          search={search}
          sortBy={sortBy}
          onCategoryChange={(c) => dispatch(setCategory(c))}
          onSearchChange={(v) => dispatch(setSearch(v))}
          onSortChange={(s) => dispatch(setSortBy(s))}
        />
        {error ? (
          <p role="alert">{error}</p>
        ) : loading ? (
          <LoadingIndicator>Getting your next favorites ready<span>…</span></LoadingIndicator>
        ) : (
          <>
            <div className="result-count">{list.length} devices, endless possibilities</div>
            <section className="product-grid" aria-label="Product list">
              {list.map((device) => (
                <DeviceCard key={device.id} device={device} />
              ))}
            </section>
            {!list.length && <LoadingIndicator>No devices found. Try another search.</LoadingIndicator>}
          </>
        )}
        <BenefitsSection />
      </main>
      <SiteFooter decorated />
    </>
  )
}
