import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell'
import { getAccessToken } from '../utils/auth'

export default function Landing() {
  const isAuthenticated = Boolean(getAccessToken())

  return (
    <PageShell isAuthenticated={isAuthenticated}>
      <div className="flex items-center justify-center px-6 py-12">
        <section className="w-full max-w-6xl grid gap-10 rounded-2xl border border-border bg-surface p-10 shadow-soft my-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5 flex flex-col justify-center">
            <h1 className="text-4xl font-semibold text-primary">
              A calm space to track daily expenses.
            </h1>
            <p className="text-base text-secondary">
              Capture spending in seconds, filter by category, and stay on top of your
              totals with a minimal dashboard designed for clarity.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/dashboard"
                className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white"
              >
                Open Dashboard
              </Link>
              <Link
                to="/signup"
                className="rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-primary"
              >
                Create account
              </Link>
            </div>
          </div>
          <div className="space-y-6 rounded-xl border border-border bg-background p-6 flex flex-col justify-center">
            <div className="mb-2">
              <p className="text-xs uppercase tracking-[0.2em] text-secondary">This Month</p>
              <p className="mt-2 text-3xl font-semibold text-primary">₹8,450</p>
              <p className="text-sm text-secondary">Across 22 expenses</p>
            </div>
            <div className="rounded-lg border border-border bg-surface p-4">
              <p className="mb-2 text-xs text-secondary font-semibold">Spending by Category</p>
              <svg viewBox="0 0 220 80" width="100%" height="80" className="w-full h-20">
                <rect x="10" y="30" width="40" height="40" fill="#34d399" rx="4" />
                <text x="30" y="25" textAnchor="middle" fontSize="12" fill="#374151">Food</text>
                <rect x="60" y="50" width="40" height="20" fill="#60a5fa" rx="4" />
                <text x="80" y="45" textAnchor="middle" fontSize="12" fill="#374151">Travel</text>
                <rect x="110" y="20" width="40" height="50" fill="#f472b6" rx="4" />
                <text x="130" y="15" textAnchor="middle" fontSize="12" fill="#374151">Shop</text>
                <rect x="160" y="50" width="40" height="20" fill="#fbbf24" rx="4" />
                <text x="180" y="45" textAnchor="middle" fontSize="12" fill="#374151">Bills</text>
              </svg>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2"><span className="inline-block h-3 w-3 rounded bg-emerald-400"></span>Food: <span className="font-semibold text-primary">₹2,200</span></div>
                <div className="flex items-center gap-2"><span className="inline-block h-3 w-3 rounded bg-blue-400"></span>Travel: <span className="font-semibold text-primary">₹1,100</span></div>
                <div className="flex items-center gap-2"><span className="inline-block h-3 w-3 rounded bg-pink-400"></span>Shopping: <span className="font-semibold text-primary">₹4,000</span></div>
                <div className="flex items-center gap-2"><span className="inline-block h-3 w-3 rounded bg-yellow-400"></span>Bills: <span className="font-semibold text-primary">₹1,150</span></div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-4 justify-between text-xs">
              <div className="flex flex-col items-center bg-surface border border-border rounded-lg px-3 py-2 min-w-[90px]">
                <span className="font-bold text-lg text-primary">₹1,240</span>
                <span className="text-secondary">Today</span>
              </div>
              <div className="flex flex-col items-center bg-surface border border-border rounded-lg px-3 py-2 min-w-[90px]">
                <span className="font-bold text-lg text-primary">₹3,200</span>
                <span className="text-secondary">This Week</span>
              </div>
              <div className="flex flex-col items-center bg-surface border border-border rounded-lg px-3 py-2 min-w-[90px]">
                <span className="font-bold text-lg text-primary">₹8,450</span>
                <span className="text-secondary">This Month</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  )
}
