function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#4A5D23' }}>
      <div className="container">
        <span className="navbar-brand d-flex align-items-center">
          <img src="/logo.png" alt="QRedirect" height="30" className="me-2" />
          <span className="text-white fw-bold fs-4" style={{ color: '#fff' }}>QREDIRECT</span>
        </span>
        
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <span className="nav-link text-white" style={{ cursor: 'default' }}>Inicio</span>
            </li>
            <li className="nav-item">
              <span className="nav-link text-white" style={{ cursor: 'default' }}>Crear QR</span>
            </li>
            <li className="nav-item">
              <span className="nav-link text-white" style={{ cursor: 'default' }}>Acortar link</span>
            </li>
            <li className="nav-item">
              <span className="nav-link text-white" style={{ cursor: 'default' }}>Características</span>
            </li>
            <li className="nav-item">
              <span className="nav-link text-white" style={{ cursor: 'default' }}>Precios</span>
            </li>
            <li className="nav-item">
              <span className="nav-link text-white" style={{ cursor: 'default' }}>Contacto</span>
            </li>
          </ul>
          
          <span className="btn" style={{ backgroundColor: '#C5CEB8', color: '#2D3A1C', cursor: 'default' }}>
            Crear mi primer QR <i className="bi bi-arrow-right"></i>
          </span>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
