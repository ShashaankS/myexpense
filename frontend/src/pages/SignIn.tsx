import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { setAccessToken } from '../utils/auth'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export default function SignIn() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setStatus('')
    setError('')

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      setError('Supabase credentials are missing in .env.')
      return
    }
    if (!email.trim() || !password) {
      setError('Email and password are required.')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(
        `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        },
      )

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        const detail = payload?.msg || payload?.error_description || payload?.error
        throw new Error(detail || 'Sign in failed. Please retry.')
      }

      const payload = await response.json()
      const token = payload?.access_token || ''
      if (token) {
        setAccessToken(token)
      }
      setStatus('Signed in successfully.')
      navigate('/dashboard')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign in failed.'
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-6 px-6 py-12">
      <div className="space-y-2 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-secondary">Welcome back</p>
        <h1 className="text-3xl font-semibold text-primary">Sign in</h1>
        <p className="text-sm text-secondary">Access your expense dashboard.</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border border-border bg-surface p-6 shadow-soft"
      >
        <div>
          <label className="text-sm font-medium text-primary">Email</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-primary">Password</label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
        {status && (
          <p className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
            {status}
          </p>
        )}
        {error && (
          <p className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-600">
            {error}
          </p>
        )}
      </form>

      <p className="text-center text-sm text-secondary">
        No account yet?{' '}
        <Link to="/signup" className="font-semibold text-primary">
          Create one
        </Link>
      </p>
    </div>
  )
}
