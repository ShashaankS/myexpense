const TOKEN_KEY = 'expense_access_token'

export const getAccessToken = (): string => {
  return localStorage.getItem(TOKEN_KEY) || ''
}

export const setAccessToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token)
}

export const clearAccessToken = () => {
  localStorage.removeItem(TOKEN_KEY)
}
