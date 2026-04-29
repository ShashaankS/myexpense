import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Dashboard from './pages/Dashboard'
import Landing from './pages/Landing'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import { getAccessToken } from './utils/auth'

export default function App() {
  const token = getAccessToken()

  return (
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
  )
}
