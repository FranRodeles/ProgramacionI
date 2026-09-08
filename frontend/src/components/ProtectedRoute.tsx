import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../context/useAuth'

function ProtectedRoute({ children, message }: { children: ReactNode; message?: string }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="auth-page">
        <div className="spinner-border qredirect-spinner" role="status" aria-label="Cargando">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace state={message ? { message } : undefined} />
  return <>{children}</>
}

export default ProtectedRoute
