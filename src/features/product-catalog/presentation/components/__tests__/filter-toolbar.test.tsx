import { describe, it, expect, vi } from 'vitest'
import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FilterToolbar } from '../filter-toolbar'
import { CategoryFilter, SortOption } from '../../../domain/device'

/**
 * The toolbar is controlled (search/category/sort come from the store), so the
 * harness mirrors a value back into state exactly like the wired page does.
 */
function setup() {
  const handlers = {
    onCategoryChange: vi.fn(),
    onSearchChange: vi.fn(),
    onSortChange: vi.fn(),
  }

  function Harness() {
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState<CategoryFilter>('All devices')
    const [sortBy, setSortBy] = useState<SortOption>('featured')
    return (
      <FilterToolbar
        search={search}
        category={category}
        sortBy={sortBy}
        onSearchChange={(v) => {
          setSearch(v)
          handlers.onSearchChange(v)
        }}
        onCategoryChange={(c) => {
          setCategory(c)
          handlers.onCategoryChange(c)
        }}
        onSortChange={(s) => {
          setSortBy(s)
          handlers.onSortChange(s)
        }}
      />
    )
  }

  render(<Harness />)
  return handlers
}

describe('Component: FilterToolbar', () => {
  it('should render the three category tabs', () => {
    setup()

    expect(screen.getByRole('button', { name: /all devices/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /smartphones/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /tablets/i })).toBeInTheDocument()
  })

  it('should mark the active category tab', async () => {
    const user = userEvent.setup()
    setup()

    await user.click(screen.getByRole('button', { name: /tablets/i }))

    expect(screen.getByRole('button', { name: /tablets/i })).toHaveClass('active')
    expect(screen.getByRole('button', { name: /all devices/i })).not.toHaveClass('active')
  })

  it('should report the full search query as it is typed', async () => {
    const user = userEvent.setup()
    const handlers = setup()

    await user.type(screen.getByLabelText('Search devices'), 'pixel')

    expect(handlers.onSearchChange).toHaveBeenLastCalledWith('pixel')
    expect(screen.getByLabelText('Search devices')).toHaveValue('pixel')
  })

  it('should report category and sort changes', async () => {
    const user = userEvent.setup()
    const handlers = setup()

    await user.click(screen.getByRole('button', { name: /smartphones/i }))
    expect(handlers.onCategoryChange).toHaveBeenCalledWith('Smartphones')

    await user.selectOptions(screen.getByLabelText('Sort devices'), 'low')
    expect(handlers.onSortChange).toHaveBeenCalledWith('low')
  })
})
