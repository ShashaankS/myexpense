import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 py-12">
      <header className="flex items-center justify-between">
        <div className="text-sm font-semibold uppercase tracking-[0.25em] text-secondary">
          Expense Tracker
        </div>
        <div className="flex gap-3">
          <Link
            to="/signin"
            className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-primary"
          >
            Sign in
          </Link>
          <Link
            to="/signup"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white"
          >
            Sign up
          </Link>
        </div>
      </header>

      <section className="grid gap-10 rounded-2xl border border-border bg-surface p-10 shadow-soft lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
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
        <div className="space-y-4 rounded-xl border border-border bg-background p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-secondary">Today</p>
            <p className="mt-2 text-3xl font-semibold text-primary">₹1,240</p>
            <p className="text-sm text-secondary">Across 4 expenses</p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-secondary">Food</span>
              <span className="font-semibold text-primary">₹420</span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-secondary">Travel</span>
              <span className="font-semibold text-primary">₹320</span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-secondary">Shopping</span>
              <span className="font-semibold text-primary">₹500</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
