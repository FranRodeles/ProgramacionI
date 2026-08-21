import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import type { FormEvent } from 'react'
import { useAuth } from '../context/useAuth'

function Register() {
  const { user, register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (user) return <Navigate to="/" replace />

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!register({ name, email, username, password })) {
      setError('El nombre de usuario ya está en uso')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <img src="/logo_sin_fondo.png" alt="QRedirect" className="auth-logo" />
        <h1 className="auth-title">Crear tu cuenta</h1>
        <p className="auth-subtitle">Registrate para empezar a usar QRedirect</p>

        {error && <div className="alert alert-danger auth-alert">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label auth-label">Nombre</label>
            <input
              id="name"
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label auth-label">Email</label>
            <input
              id="email"
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="username" className="form-label auth-label">Usuario</label>
            <input
              id="username"
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              required
            />
          </div>
          <button type="submit" className="btn auth-submit w-100">
            Registrarse
          </button>
        </form>

        <p className="auth-footer">
          ¿Ya tenés cuenta? <Link to="/login" className="auth-link">Iniciar sesión</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
