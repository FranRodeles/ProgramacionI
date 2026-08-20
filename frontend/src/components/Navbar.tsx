import { useState } from 'react'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="navbar qredirect-navbar">
      <div className="container">
        <a className="navbar-brand qredirect-brand" href="#inicio" aria-label="QRedirect, inicio">
          <img src="/logo_sin_fondo.png" alt="QRedirect" className="qredirect-logo" />
        </a>
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
            <a className="btn qredirect-nav-cta" href="#crear-qr" onClick={() => setIsOpen(false)}>
              Crear mi primer QR <i className="bi bi-arrow-right" />
            </a>
            <a className="qredirect-login-link" href="#iniciar-sesion" onClick={() => setIsOpen(false)}>Iniciar sesión</a>
            <a className="qredirect-register-link" href="#registrarse" onClick={() => setIsOpen(false)}>Registrarse</a>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
