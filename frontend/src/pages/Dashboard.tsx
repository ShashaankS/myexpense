import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import ExpenseFilters from '../components/ExpenseFilters'
import ExpenseFormModal from '../components/ExpenseFormModal'
import ExpenseTable from '../components/ExpenseTable'
import { clearAccessToken } from '../utils/auth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

type Expense = {
  id: string
  amount: number
  category: string
  description: string
  date: string
}

type ExpenseListResponse = {
  expenses: Expense[]
  total: number
}

const fetchExpenses = async (category: string, sort: string) => {
  const params = new URLSearchParams()
  if (category && category !== 'All') {
    params.set('category', category)
  }
  if (sort) {
    params.set('sort', sort)
  }

  const response = await fetch(
    `${API_BASE_URL}/expenses${params.toString() ? `?${params}` : ''}`,
  )
  if (!response.ok) {
    throw new Error('Failed to load expenses. Please try again.')
  }
  return (await response.json()) as ExpenseListResponse
}

const createExpense = async (payload: {
  amount: number
  category: string
  description: string
  date: string
  idempotency_key: string
}) => {
  const response = await fetch(`${API_BASE_URL}/expenses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    throw new Error('Failed to add expense. Please retry.')
  }
  return response.json()
}

export default function Dashboard() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [filterCategory, setFilterCategory] = useState('All')
  const [sortOrder, setSortOrder] = useState('date_desc')
  const [modalOpen, setModalOpen] = useState(false)
  const [formError, setFormError] = useState('')

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['expenses', filterCategory, sortOrder],
    queryFn: () => fetchExpenses(filterCategory, sortOrder),
  })

  const mutation = useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      setFormError('')
      setModalOpen(false)
    },
    onError: (error: Error) => {
      setFormError(error.message)
    },
  })

  const handleAddExpense = (form: {
    amount: string
    category: string
    description: string
    date: string
  }) => {
    const payload = {
      amount: Number(form.amount),
      category: form.category,
      description: form.description.trim(),
      date: new Date(form.date).toISOString(),
      idempotency_key: crypto.randomUUID(),
    }
    mutation.mutate(payload)
  }

  const expenses = data?.expenses || []
  const total = useMemo(() => {
    return expenses.reduce((sum, expense) => sum + Number(expense.amount), 0)
  }, [expenses])

  const handleSignOut = () => {
    clearAccessToken()
    navigate('/signin')
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-secondary">
          Dashboard
        </p>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold text-primary">Expense Overview</h1>
          <p className="max-w-2xl text-sm text-secondary">
            Keep your spending organized with filters, summaries, and quick entry.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-primary"
        >
          Sign out
        </button>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-xl border border-border bg-surface p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-primary">Add Expense</h2>
          <p className="text-sm text-secondary">
            Use the quick modal to keep logging fast.
          </p>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="mt-4 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accentDark"
          >
            Open Add Expense
          </button>
          {formError && (
            <p className="mt-3 text-sm text-red-600">{formError}</p>
          )}
        </div>
        <ExpenseFilters
          category={filterCategory}
          sort={sortOrder}
          total={total}
          onCategoryChange={setFilterCategory}
          onSortChange={setSortOrder}
          onOpenModal={() => setModalOpen(true)}
        />
      </section>

      {isLoading && (
        <div className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-secondary">
          Loading expenses...
        </div>
      )}

      {isError && (
        <div className="flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          Something went wrong while loading expenses.
          <button
            type="button"
            onClick={() => refetch()}
            className="w-fit rounded-lg border border-red-200 bg-white px-3 py-1 text-xs font-semibold text-red-600"
          >
            Retry
          </button>
        </div>
      )}

      {!isLoading && !isError && expenses.length === 0 && (
        <div className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-secondary">
          No expenses found.
        </div>
      )}

      {!isLoading && !isError && expenses.length > 0 && (
        <ExpenseTable expenses={expenses} />
      )}

      <ExpenseFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddExpense}
        isSubmitting={mutation.isPending}
      />
    </div>
  )
}
