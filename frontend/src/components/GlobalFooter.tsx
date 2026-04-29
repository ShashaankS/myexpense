export default function GlobalFooter() {
  return (
    <footer className="w-full border-t border-border bg-surface shadow-soft">
      <div className="mx-auto max-w-6xl flex flex-col gap-3 px-6 py-4 text-sm text-secondary sm:flex-row sm:items-center sm:justify-between">
        <p>Build better spending habits with a simple, privacy-friendly expense tracker.</p>
        <p className="text-xs">© {new Date().getFullYear()} MyExpense. All rights reserved.</p>
      </div>
    </footer>
  )
}
