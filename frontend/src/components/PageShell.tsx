import { type ReactNode } from 'react'
import GlobalHeader from './GlobalHeader'
import GlobalFooter from './GlobalFooter'

export default function PageShell({
  children,
  isAuthenticated,
  onSignOut,
}: {
  children: ReactNode
  isAuthenticated: boolean
  onSignOut?: () => void
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <GlobalHeader isAuthenticated={isAuthenticated} onSignOut={onSignOut} />
      <main className="flex-1">{children}</main>
      <GlobalFooter />
    </div>
  )
}
