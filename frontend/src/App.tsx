import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Dashboard from './pages/Dashboard'
import Landing from './pages/Landing'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import { clearAccessToken, getAccessToken, setAccessToken } from './utils/auth'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'

export default function App() {
  const [token, setToken] = useState(getAccessToken())

  const handleAuthSuccess = (accessToken: string) => {
    setAccessToken(accessToken)
    setToken(accessToken)
  }

  const handleSignOut = () => {
    clearAccessToken()
    setToken('')
  }

  return (
    <AuthProvider value={{ onAuthSuccess: handleAuthSuccess, onSignOut: handleSignOut }}>
      <ToastProvider>
        <div className="app">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route
              path="/signin"
              element={token ? <Navigate to="/dashboard" replace /> : <SignIn />}
            />
            <Route
              path="/signup"
              element={token ? <Navigate to="/dashboard" replace /> : <SignUp />}
            />
            <Route
              path="/dashboard"
              element={token ? <Dashboard /> : <Navigate to="/signin" replace />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </ToastProvider>
    </AuthProvider>
  )
}
