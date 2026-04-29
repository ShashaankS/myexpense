import { Link } from 'react-router-dom'

type GlobalHeaderProps = {
  isAuthenticated: boolean
  onSignOut?: () => void
}

export default function GlobalHeader({ isAuthenticated, onSignOut }: GlobalHeaderProps) {
  return (
    <header className="w-full border-b border-border bg-surface shadow-soft">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-lg uppercase tracking-[0.4em] text-secondary">MyExpense</p>
            <p className="text-sm font-semibold text-gray-500">Expense Tracker</p>
          </div>
        </div>

        <nav className="flex flex-wrap gap-3">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-primary"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={onSignOut}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accentDark"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-primary"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accentDark"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
