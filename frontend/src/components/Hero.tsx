import '../styles/animations.css'

function Hero() {
  return (
    <section style={{ backgroundColor: '#F5F3EF' }}>
      <div className="container py-5">
        <div className="row align-items-center">
          {/* Lado izquierdo - Texto */}
          <div className="col-lg-6 mb-5 mb-lg-0">
            <div className="mb-3">
              <span className="badge px-3 py-2" style={{ backgroundColor: '#E8E5DE', color: '#4A5D23', borderRadius: '20px', fontSize: '0.85rem' }}>
                QR DINÁMICOS · ACORTA LINKS · ANALIZA
              </span>
            </div>
            
            <h1 className="display-4 fw-bold mb-4">
              Crea códigos{' '}
              <span style={{ color: '#4A5D23' }}>QR dinámicos</span>{' '}
              al instante
            </h1>
            
            <p className="lead mb-4" style={{ color: '#555' }}>
              Genera, personaliza y analiza tus QR dinámicos. También acorta URL y lleva todo el control en un solo lugar
            </p>
            
            <div className="d-flex align-items-center gap-3">
              <span className="btn btn-lg text-white px-4 py-3" style={{ backgroundColor: '#4A5D23', borderRadius: '30px', cursor: 'default' }}>
                Crear mi primer QR <i className="bi bi-arrow-right ms-2"></i>
              </span>
              <span style={{ color: '#666' }}>¡Es gratis! →</span>
            </div>
          </div>
          
          {/* Lado derecho - Mockup visual */}
          <div className="col-lg-6 position-relative">
            <div className="position-relative" style={{ minHeight: '500px' }}>
              {/* Círculo verde claro de fondo con animación de olas */}
              <div 
                className="position-absolute wave-animation"
                style={{
                  width: '400px',
                  height: '400px',
                  backgroundColor: '#C5CEB8',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 0
                }}
              />
              
              {/* Segundo círculo con animación más lenta */}
              <div 
                className="position-absolute wave-animation-slow"
                style={{
                  width: '380px',
                  height: '380px',
                  backgroundColor: '#D4DEC9',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 0,
                  opacity: 0.7
                }}
              />
              
              {/* QR Code mockup - 250px */}
              <div 
                className="position-absolute bg-white p-4 shadow"
                style={{
                  width: '250px',
                  height: '250px',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  borderRadius: '20px',
                  zIndex: 2
                }}
              >
                <div className="d-flex flex-column align-items-center justify-content-center h-100">
                  <div style={{ 
                    width: '180px', 
                    height: '180px', 
                    background: 'linear-gradient(135deg, #4A5D23 25%, transparent 25%), linear-gradient(225deg, #4A5D23 25%, transparent 25%), linear-gradient(45deg, #4A5D23 25%, transparent 25%), linear-gradient(315deg, #4A5D23 25%, transparent 25%)',
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 10px 0, 10px -10px, 0 10px',
                    backgroundColor: '#fff'
                  }} />
                </div>
              </div>
              
              {/* Card "Acorta tus links" */}
              <div 
                className="position-absolute bg-white p-2 shadow-sm"
                style={{
                  width: '140px',
                  top: '15%',
                  left: '5%',
                  borderRadius: '10px',
                  zIndex: 3
                }}
              >
                <div className="d-flex align-items-center">
                  <div className="rounded-circle me-2 d-flex align-items-center justify-content-center" style={{ width: '35px', height: '35px', backgroundColor: '#E8E5DE' }}>
                    <i className="bi bi-link-45deg" style={{ color: '#4A5D23' }}></i>
                  </div>
                  <div>
                    <small className="fw-bold d-block" style={{ fontSize: '0.75rem' }}>Acorta</small>
                    <small style={{ fontSize: '0.65rem', color: '#666' }}>tus links</small>
                  </div>
                </div>
              </div>
              
              {/* Card "Personaliza a tu estilo" */}
              <div 
                className="position-absolute bg-white p-2 shadow-sm"
                style={{
                  width: '160px',
                  bottom: '20%',
                  left: '0%',
                  borderRadius: '10px',
                  zIndex: 3
                }}
              >
                <div className="d-flex align-items-center">
                  <div className="rounded-circle me-2 d-flex align-items-center justify-content-center" style={{ width: '35px', height: '35px', backgroundColor: '#E8E5DE' }}>
                    <i className="bi bi-palette" style={{ color: '#4A5D23' }}></i>
                  </div>
                  <div>
                    <small className="fw-bold d-block" style={{ fontSize: '0.75rem' }}>Personaliza</small>
                    <small style={{ fontSize: '0.65rem', color: '#666' }}>a tu estilo</small>
                  </div>
                </div>
              </div>
              
              {/* Card Estadísticas */}
              <div 
                className="position-absolute bg-white p-3 shadow"
                style={{
                  width: '200px',
                  top: '10%',
                  right: '0%',
                  borderRadius: '10px',
                  zIndex: 3
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <small className="fw-bold">Estadísticas</small>
                  <small className="text-muted" style={{ fontSize: '0.65rem' }}>Últimos 7 días</small>
                </div>
                <div style={{ height: '60px', background: 'linear-gradient(to top, #C5CEB8 0%, transparent 100%)', borderRadius: '5px', marginBottom: '10px' }} />
                <div className="d-flex justify-content-between">
                  <div className="text-center">
                    <small className="d-block text-muted" style={{ fontSize: '0.6rem' }}>Escaneos</small>
                    <small className="fw-bold">1.248</small>
                  </div>
                  <div className="text-center">
                    <small className="d-block text-muted" style={{ fontSize: '0.6rem' }}>Usuarios</small>
                    <small className="fw-bold">1.012</small>
                  </div>
                  <div className="text-center">
                    <small className="d-block text-muted" style={{ fontSize: '0.6rem' }}>Clics</small>
                    <small className="fw-bold">892</small>
                  </div>
                </div>
              </div>
              
              {/* Card "Analiza en tiempo real" */}
              <div 
                className="position-absolute bg-white p-2 shadow-sm"
                style={{
                  width: '150px',
                  bottom: '15%',
                  right: '5%',
                  borderRadius: '10px',
                  zIndex: 3
                }}
              >
                <div className="d-flex align-items-center">
                  <div className="rounded-circle me-2 d-flex align-items-center justify-content-center" style={{ width: '35px', height: '35px', backgroundColor: '#E8E5DE' }}>
                    <i className="bi bi-bar-chart" style={{ color: '#4A5D23' }}></i>
                  </div>
                  <div>
                    <small className="fw-bold d-block" style={{ fontSize: '0.75rem' }}>Analiza</small>
                    <small style={{ fontSize: '0.65rem', color: '#666' }}>en tiempo real</small>
                  </div>
                </div>
              </div>
              
              {/* Hojas decorativas */}
              <div 
                className="position-absolute"
                style={{
                  top: '5%',
                  right: '5%',
                  fontSize: '2rem',
                  color: '#4A5D23',
                  transform: 'rotate(15deg)',
                  zIndex: 1
                }}
              >
                🌿
              </div>
              <div 
                className="position-absolute"
                style={{
                  bottom: '5%',
                  right: '10%',
                  fontSize: '1.5rem',
                  color: '#4A5D23',
                  transform: 'rotate(-10deg)',
                  zIndex: 1
                }}
              >
                🌿
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
