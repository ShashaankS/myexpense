const categories = ['All', 'Food', 'Travel', 'Shopping', 'Other']

export default function ExpenseFilters({
  category,
  sort,
  onCategoryChange,
  onSortChange,
  onOpenModal,
}: {
  category: string
  sort: string
  onCategoryChange: (value: string) => void
  onSortChange: (value: string) => void
  onOpenModal: () => void
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-6 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-primary">Filters</h2>
          <p className="text-sm text-secondary">
            Refine the list by category and date.
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-4">
        <div>
          <label className="text-sm font-medium text-primary">Category</label>
          <select
            value={category}
            onChange={(event) => onCategoryChange(event.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            {categories.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-primary">Sort by Date</label>
          <select
            value={sort}
            onChange={(event) => onSortChange(event.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="date_desc">Newest first</option>
            <option value="date_asc">Oldest first</option>
          </select>
        </div>
      </div>
    </div>
  )
}
