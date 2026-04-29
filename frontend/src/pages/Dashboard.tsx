import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import ExpenseFilters from '../components/ExpenseFilters'
import ExpenseFormModal from '../components/ExpenseFormModal'
import ExpenseTable from '../components/ExpenseTable'
import PageShell from '../components/PageShell'
import { getAccessToken } from '../utils/auth'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'

const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
const API_BASE_URL = rawApiBaseUrl.match(/^https?:\/\//i)
  ? rawApiBaseUrl.replace(/\/$/, '')
  : `https://${rawApiBaseUrl.replace(/\/$/, '')}`

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

const getAuthHeaders = () => {
  const token = getAccessToken()
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  }
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
    {
      headers: getAuthHeaders(),
    }
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
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    throw new Error('Failed to add expense. Please retry.')
  }
  return response.json()
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { onSignOut } = useAuth()
  const { showToast } = useToast()
  const queryClient = useQueryClient()
  const [filterCategory, setFilterCategory] = useState('All')
  const [sortOrder, setSortOrder] = useState('date_desc')
  const [modalOpen, setModalOpen] = useState(false)

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['expenses', filterCategory, sortOrder],
    queryFn: () => fetchExpenses(filterCategory, sortOrder),
  })

  const mutation = useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      setModalOpen(false)
      showToast('Expense added successfully.', 'success')
    },
    onError: (error: Error) => {
      showToast(error.message, 'error')
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
    onSignOut()
    showToast('Signed out successfully.', 'success')
    navigate('/signin')
  }

  return (
    <PageShell isAuthenticated={true} onSignOut={handleSignOut}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-secondary">
            Dashboard
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-surface p-6 shadow-soft">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-secondary">Summary</p>
                  <h2 className="text-2xl font-semibold text-primary">Expenses at a glance</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accentDark"
                >
                  + Add Expense
                </button>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-border bg-background p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-secondary">Total spent</p>
                  <p className="mt-2 text-3xl font-semibold text-primary">₹{total.toFixed(2)}</p>
                </div>
                <div className="rounded-2xl border border-border bg-background p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-secondary">Expenses</p>
                  <p className="mt-2 text-3xl font-semibold text-primary">{expenses.length}</p>
                </div>
              </div>
            </div>

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
          </div>

          <ExpenseFilters
            category={filterCategory}
            sort={sortOrder}
            onCategoryChange={setFilterCategory}
            onSortChange={setSortOrder}
            onOpenModal={() => setModalOpen(true)}
          />
        </section>

        <ExpenseFormModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleAddExpense}
          isSubmitting={mutation.isPending}
        />
      </div>
    </PageShell>
  )
}
