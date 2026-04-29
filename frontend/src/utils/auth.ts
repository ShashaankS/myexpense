const TOKEN_KEY = 'expense_access_token'
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL

export const getAccessToken = (): string => {
  return localStorage.getItem(TOKEN_KEY) || ''
}

export const setAccessToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token)
}

export const clearAccessToken = () => {
  localStorage.removeItem(TOKEN_KEY)
}

export const parseOAuthRedirectHash = () => {
  if (typeof window === 'undefined') {
    return { accessToken: '', error: '' }
  }

  const hash = window.location.hash.replace(/^#/, '')
  if (!hash) {
    return { accessToken: '', error: '' }
  }

  const params = new URLSearchParams(hash)
  const accessToken = params.get('access_token') || ''
  const error = params.get('error_description') || params.get('error') || ''

  return { accessToken, error }
}

export const clearOAuthRedirectHash = () => {
  if (typeof window === 'undefined') {
    return
  }
  if (window.history.replaceState) {
    window.history.replaceState(null, document.title, window.location.pathname + window.location.search)
  } else {
    window.location.hash = ''
  }
}

export const getSupabaseGoogleAuthUrl = (redirectTo?: string) => {
  const redirect = redirectTo || `${typeof window !== 'undefined' ? window.location.origin : ''}/signin`
  if (!SUPABASE_URL) {
    return ''
  }
  return `${SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirect)}`
}
