import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import type { FormEvent } from 'react'
import { useAuth } from '../context/useAuth'

function Login() {
  const { user, login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (user) return <Navigate to="/" replace />

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    const result = await login(username, password)
    setSubmitting(false)
    if (!result.success) {
      setError(result.error ?? 'No se pudo iniciar sesión')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <img src="/logo_sin_fondo.png" alt="QRedirect" className="auth-logo" />
        <h1 className="auth-title">Iniciar sesión</h1>
        <p className="auth-subtitle">Accedé a tu cuenta de QRedirect</p>

        {error && (
          <div id="login-error" role="alert" className="alert alert-danger auth-alert">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label auth-label">Usuario</label>
            <input
              id="username"
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              aria-describedby={error ? 'login-error' : undefined}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="form-label auth-label">Contraseña</label>
            <input
              id="password"
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              aria-describedby={error ? 'login-error' : undefined}
              required
            />
          </div>
          <button type="submit" className="btn auth-submit w-100" disabled={submitting}>
            {submitting ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>

        <p className="auth-footer">
          ¿No tenés cuenta? <Link to="/register" className="auth-link">Registrarse</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
