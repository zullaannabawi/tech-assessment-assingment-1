'use client'

import { Search, Smartphone, Tablet, LayoutGrid } from 'lucide-react'
import { CATEGORY_FILTERS, CategoryFilter, SortOption } from '../../domain/device'

const TAB_ICONS = [LayoutGrid, Smartphone, Tablet]

interface FilterToolbarProps {
  category: CategoryFilter
  search: string
  sortBy: SortOption
  onCategoryChange: (category: CategoryFilter) => void
  onSearchChange: (search: string) => void
  onSortChange: (sortBy: SortOption) => void
}

/**
 * Category tabs, search box, and price sorting. Purely prop-driven so it can
 * be tested without a store; the page wires it to the device-filter slice.
 */
export function FilterToolbar({
  category,
  search,
  sortBy,
  onCategoryChange,
  onSearchChange,
  onSortChange,
}: FilterToolbarProps) {
  return (
    <div className="toolbar">
      <div className="tabs">
        {CATEGORY_FILTERS.map((c, i) => {
          const Icon = TAB_ICONS[i]
          return (
            <button key={c} className={category === c ? 'active' : ''} onClick={() => onCategoryChange(c)}><Icon size={15}/>{c}</button>
          )
        })}
      </div>
      <div className="tools">
        <label className="search"><Search size={16}/><input aria-label="Search devices" placeholder="Search devices…" value={search} onChange={e => onSearchChange(e.target.value)}/></label>
        <select aria-label="Sort devices" value={sortBy} onChange={e => onSortChange(e.target.value as SortOption)}>
          <option value="featured">Featured</option>
          <option value="low">Price: low to high</option>
          <option value="high">Price: high to low</option>
        </select>
      </div>
    </div>
  )
}
