import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../context/useAuth'

function ProtectedRoute({ children, message }: { children: ReactNode; message?: string }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="auth-page">
        <div className="spinner-border qredirect-spinner" role="status" aria-label="Cargando">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    )
  }
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ ...(message ? { message } : {}), from: location }}
      />
    )
  }
  return <>{children}</>
}

export default ProtectedRoute
