import { useState } from 'react'

const categories = ['Food', 'Travel', 'Shopping', 'Other']

const emptyForm = {
  amount: '',
  category: 'Food',
  description: '',
  date: '',
}

type FormState = typeof emptyForm

type FormErrors = {
  amount?: string
  category?: string
  description?: string
  date?: string
}

export default function ExpenseFormModal({
  open,
  onClose,
  onSubmit,
  isSubmitting,
}: {
  open: boolean
  onClose: () => void
  onSubmit: (data: FormState) => void
  isSubmitting: boolean
}) {
  const [form, setForm] = useState<FormState>(emptyForm)
  const [errors, setErrors] = useState<FormErrors>({})

  if (!open) return null

  const validate = () => {
    const nextErrors: FormErrors = {}
    const amountValue = Number(form.amount)
    if (!Number.isFinite(amountValue) || amountValue <= 0) {
      nextErrors.amount = 'Amount must be greater than 0.'
    }
    if (!form.category) {
      nextErrors.category = 'Category is required.'
    }
    if (!form.description.trim()) {
      nextErrors.description = 'Description is required.'
    }
    if (!form.date) {
      nextErrors.date = 'Date is required.'
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!validate()) return
    onSubmit(form)
    setForm(emptyForm)
    setErrors({})
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-xl border border-border bg-surface p-6 shadow-soft">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-primary">Add Expense</h2>
            <p className="text-sm text-secondary">
              Fill in the details and save your expense.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-secondary hover:text-primary"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-primary">Amount</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={(event) => setForm({ ...form, amount: event.target.value })}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              placeholder="0.00"
            />
            {errors.amount && (
              <p className="mt-1 text-xs text-red-500">{errors.amount}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-primary">Category</label>
            <select
              value={form.category}
              onChange={(event) => setForm({ ...form, category: event.target.value })}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-xs text-red-500">{errors.category}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-primary">Description</label>
            <input
              type="text"
              value={form.description}
              onChange={(event) =>
                setForm({ ...form, description: event.target.value })
              }
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              placeholder="Lunch, taxi, groceries"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-500">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-primary">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(event) => setForm({ ...form, date: event.target.value })}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
            {errors.date && (
              <p className="mt-1 text-xs text-red-500">{errors.date}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accentDark disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Saving...' : '+ Add Expense'}
          </button>
        </form>
      </div>
    </div>
  )
}
