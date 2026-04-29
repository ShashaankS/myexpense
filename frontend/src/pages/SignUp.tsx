import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageShell from '../components/PageShell'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { getAccessToken } from '../utils/auth'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export default function SignUp() {
  const navigate = useNavigate()
  const { onAuthSuccess } = useAuth()
  const { showToast } = useToast()
  const isAuthenticated = Boolean(getAccessToken())
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      const message = 'Supabase credentials are missing in .env.'
      setError(message)
      showToast(message, 'error')
      return
    }
    if (!name.trim()) {
      const message = 'Name is required.'
      setError(message)
      showToast(message, 'error')
      return
    }
    if (!email.trim() || !password) {
      const message = 'Email and password are required.'
      setError(message)
      showToast(message, 'error')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
          data: { full_name: name.trim() },
        }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        const detail = payload?.msg || payload?.error_description || payload?.error
        throw new Error(detail || 'Sign up failed. Please retry.')
      }

      const payload = await response.json()
      const token = payload?.access_token || ''
      const user = payload?.user
      if (!token) {
        if (user) {
          showToast('Account created. Please confirm your email to sign in.', 'success')
          navigate('/signin')
          return
        }
        throw new Error('Sign up failed. No access token returned.')
      }

      onAuthSuccess(token)
      showToast('Account created successfully.', 'success')
      navigate('/dashboard')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign up failed.'
      setError(message)
      showToast(message, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PageShell isAuthenticated={isAuthenticated}>
      <div className="mx-auto flex w-full max-w-md flex-col justify-center gap-6 px-6 py-12">
        <div className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-secondary">Get started</p>
          <h1 className="text-3xl font-semibold text-primary">Create account</h1>
          <p className="text-sm text-secondary">Join the expense tracker in minutes.</p>
        </div>

        <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border border-border bg-surface p-6 shadow-soft"
      >
        <div>
          <label className="text-sm font-medium text-primary">Full name</label>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            placeholder="Your name"
          />
        </div>
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
          {isSubmitting ? 'Creating...' : 'Create account'}
        </button>
        {error && (
          <p className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-600">
            {error}
          </p>
        )}
      </form>

      <p className="text-center text-sm text-secondary">
        Already have an account?{' '}
        <Link to="/signin" className="font-semibold text-primary">
          Sign in
        </Link>
      </p>
    </div>
    </PageShell>
  )
}
