import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    setIsOpen(false)
    await logout()
  }

  return (
    <nav className="navbar qredirect-navbar">
      <div className="container">
        <Link className="navbar-brand qredirect-brand" to="/" aria-label="QRedirect, inicio">
          <img src="/logo_sin_fondo.png" alt="QRedirect" className="qredirect-logo" />
        </Link>
        <button className="navbar-toggler" type="button" onClick={() => setIsOpen(!isOpen)} aria-expanded={isOpen} aria-label="Abrir menú">
          <i className={`bi ${isOpen ? 'bi-x-lg' : 'bi-list'}`} />
        </button>
        <div className={`qredirect-collapse ${isOpen ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto qredirect-nav-links">
            {['Inicio', 'Crear QR', 'Acortar link', 'Características', 'Precios'].map((label, index) => (
              <li className="nav-item" key={label}>
                <a className={`nav-link ${index === 0 ? 'active' : ''}`} href={index === 0 ? '#inicio' : '#caracteristicas'} onClick={() => setIsOpen(false)}>{label}</a>
              </li>
            ))}
          </ul>
          <div className="qredirect-nav-actions">
            {user ? (
              <>
                <span className="qredirect-user-name"><i className="bi bi-person-circle me-1" />{user.first_name || user.username}</span>
                <button className="btn qredirect-nav-logout" type="button" onClick={handleLogout}>
                  Cerrar sesión <i className="bi bi-box-arrow-right ms-1" />
                </button>
              </>
            ) : (
              <>
                <Link className="btn qredirect-nav-cta" to="/register" onClick={() => setIsOpen(false)}>
                  Crear mi primer QR <i className="bi bi-arrow-right" />
                </Link>
                <Link className="qredirect-login-link" to="/login" onClick={() => setIsOpen(false)}>Iniciar sesión</Link>
                <Link className="qredirect-register-link" to="/register" onClick={() => setIsOpen(false)}>Registrarse</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
