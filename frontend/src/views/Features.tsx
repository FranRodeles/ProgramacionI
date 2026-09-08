import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Features() {
  const destinationTypes = [
    {
      icon: 'bi-globe',
      title: 'Sitios Web',
      desc: 'Dirige a tu tienda online, portafolio o landing page con protocolo seguro HTTPS.',
      example: 'https://tuweb.com/tienda',
    },
    {
      icon: 'bi-whatsapp',
      title: 'WhatsApp Directo',
      desc: 'Inicia conversaciones al instante con número y mensaje inicial preparado.',
      example: 'wa.me/5491123456789',
    },
    {
      icon: 'bi-envelope-at',
      title: 'Correo Electrónico',
      desc: 'Prepara un correo con destinatario y asunto listo para enviar con un clic.',
      example: 'contacto@empresa.com',
    },
    {
      icon: 'bi-telephone',
      title: 'Llamada Telefónica',
      desc: 'Permite a tus clientes llamarte inmediatamente sin tener que marcar el número.',
      example: '+54 11 4321-0000',
    },
    {
      icon: 'bi-geo-alt',
      title: 'Ubicación en Mapa',
      desc: 'Comparte la ubicación exacta de tu negocio o evento en Google Maps.',
      example: 'Coordenadas o dirección',
    },
    {
      icon: 'bi-card-text',
      title: 'Texto Plano',
      desc: 'Muestra contraseñas de WiFi, mensajes de bienvenida o instrucciones sin conexión.',
      example: 'Texto informativo o claves',
    },
  ]

  const analyticsFeatures = [
    {
      icon: 'bi-clock-history',
      title: 'Fecha y hora exacta',
      desc: 'Registra en qué momento exacto se produjo cada interacción para medir picos de actividad.',
    },
    {
      icon: 'bi-phone',
      title: 'Tipo de dispositivo',
      desc: 'Detecta si tus usuarios llegan desde teléfonos inteligentes, tablets o computadoras de escritorio.',
    },
    {
      icon: 'bi-cpu',
      title: 'Sistema operativo',
      desc: 'Identifica visitas desde Android, iOS, Windows, macOS o Linux.',
    },
    {
      icon: 'bi-browser-chrome',
      title: 'Navegador web',
      desc: 'Conoce los navegadores más utilizados por tu audiencia (Chrome, Safari, Firefox, Edge, etc.).',
    },
    {
      icon: 'bi-geo',
      title: 'Ubicación geográfica',
      desc: 'Aproximación por país y ciudad a través de la dirección IP de origen.',
    },
    {
      icon: 'bi-graph-up-arrow',
      title: 'Contador de impacto',
      desc: 'Total acumulado de escaneos y clics para calcular el retorno de tus campañas.',
    },
  ]

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ background: '#fcfbf9' }}>
      <Navbar />

      <main className="flex-grow-1 py-5">
        {/* Hero Section */}
        <section className="container text-center py-4 mb-5">
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1 mb-3 rounded-pill" style={{ background: '#e9eee4', color: '#405139', fontSize: '0.85rem', fontWeight: 600 }}>
            <i className="bi bi-stars" /> Plataforma Integral de Enlaces y QR
          </div>
          <h1 className="display-4 fw-bold mb-3" style={{ color: '#2d3a1c', fontFamily: 'Georgia, serif' }}>
            Todo lo que necesitás para conectar <br className="d-none d-md-inline" /> el mundo físico con el digital
          </h1>
          <p className="lead mx-auto mb-4" style={{ maxWidth: '750px', color: '#65675e' }}>
            Generá códigos QR dinámicos altamente personalizables y enlaces cortos inteligentes.
            Medí el impacto de cada interacción en tiempo real y cambiá el destino cuando quieras <strong>sin volver a imprimir</strong>.
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <Link to="/crear-qr" className="btn auth-submit px-4 py-2" style={{ fontSize: '1.05rem' }}>
              <i className="bi bi-qr-code me-2" /> Crear Código QR
            </Link>
            <Link to="/acortar-link" className="btn btn-outline-secondary px-4 py-2" style={{ borderRadius: '0.6rem', fontWeight: 600, fontSize: '1.05rem' }}>
              <i className="bi bi-link-45deg me-2" /> Acortar un Link
            </Link>
          </div>
        </section>

        {/* Feature 1: QR Dinámicos y Reutilizables */}
        <section className="container mb-5 py-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="text-uppercase fw-bold" style={{ color: '#526b42', letterSpacing: '1px', fontSize: '0.85rem' }}>
                NUNCA MÁS REIMPRIMIR
              </span>
              <h2 className="display-6 fw-bold mt-2 mb-3" style={{ color: '#2d3a1c' }}>
                Códigos QR 100% Dinámicos
              </h2>
              <p style={{ color: '#555', fontSize: '1.05rem', lineHeight: '1.7' }}>
                A diferencia de los códigos tradicionales estáticos, los códigos de <strong>QRedirect</strong> apuntan a una ruta intermedia inteligente.
                Esto te permite <strong>modificar el destino en cualquier momento</strong> desde tu panel de control, incluso si el código ya fue impreso en miles de folletos, menús o carteles.
              </p>
              <ul className="list-unstyled mt-4 d-flex flex-column gap-3">
                <li className="d-flex align-items-start gap-2">
                  <i className="bi bi-check-circle-fill fs-5" style={{ color: '#526b42' }} />
                  <div>
                    <strong>Actualizaciones en tiempo real:</strong> Cambiá el menú, la oferta o el link sin costos de reimpresión.
                  </div>
                </li>
                <li className="d-flex align-items-start gap-2">
                  <i className="bi bi-check-circle-fill fs-5" style={{ color: '#526b42' }} />
                  <div>
                    <strong>Descarga en alta definición:</strong> Archivos PNG nítidos listos para imprenta o medios digitales.
                  </div>
                </li>
                <li className="d-flex align-items-start gap-2">
                  <i className="bi bi-check-circle-fill fs-5" style={{ color: '#526b42' }} />
                  <div>
                    <strong>Personalización visual completa:</strong> Elegí forma de puntos, estilos de esquinas, colores de contraste y sumá el logo de tu marca en el centro.
                  </div>
                </li>
              </ul>
            </div>
            <div className="col-lg-6">
              <div className="p-4 rounded-4 shadow-sm bg-white border">
                <div className="text-center mb-4">
                  <span className="badge rounded-pill px-3 py-2" style={{ background: '#edf2e7', color: '#3d4f2b', fontSize: '0.85rem' }}>
                    Tipos de Destino Soportados
                  </span>
                </div>
                <div className="row g-3">
                  {destinationTypes.map((item, index) => (
                    <div className="col-sm-6" key={index}>
                      <div className="p-3 rounded-3 h-100 border" style={{ background: '#fbfaf8' }}>
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <i className={`bi ${item.icon} fs-4`} style={{ color: '#526b42' }} />
                          <h6 className="mb-0 fw-bold" style={{ color: '#2d3a1c' }}>{item.title}</h6>
                        </div>
                        <p className="small text-muted mb-2">{item.desc}</p>
                        <span className="badge bg-light text-dark border font-monospace" style={{ fontSize: '0.72rem' }}>
                          {item.example}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature 2: Acortador de Enlaces */}
        <section className="container mb-5 py-5 rounded-4" style={{ background: '#f4f2ec' }}>
          <div className="row align-items-center g-5 px-3 px-md-4">
            <div className="col-lg-6 order-lg-2">
              <span className="text-uppercase fw-bold" style={{ color: '#526b42', letterSpacing: '1px', fontSize: '0.85rem' }}>
                LINKS CORTOS E INTELIGENTES
              </span>
              <h2 className="display-6 fw-bold mt-2 mb-3" style={{ color: '#2d3a1c' }}>
                Acortador de URLs Personalizado
              </h2>
              <p style={{ color: '#555', fontSize: '1.05rem', lineHeight: '1.7' }}>
                Olvidate de enlaces largos, complicados y poco atractivos. Creá URLs breves ideales para biografías de Instagram, campañas de marketing por WhatsApp, Twitter o SMS.
              </p>
              <div className="d-flex flex-column gap-3 mt-4">
                <div className="d-flex align-items-start gap-3">
                  <div className="rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', background: '#fff', color: '#526b42' }}>
                    <i className="bi bi-link-45deg fs-4" />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1" style={{ color: '#2d3a1c' }}>Enlaces memorables</h6>
                    <p className="small text-muted mb-0">Elegí nombres personalizados (ej: <code>/s/mi-promo/</code>). Podés tipear con espacios y se transforman automáticamente en guiones.</p>
                  </div>
                </div>
                <div className="d-flex align-items-start gap-3">
                  <div className="rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', background: '#fff', color: '#526b42' }}>
                    <i className="bi bi-lightning-charge fs-4" />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1" style={{ color: '#2d3a1c' }}>Redirección inmediata</h6>
                    <p className="small text-muted mb-0">Redirección HTTP 302 ultrarrápida sin pantallas intermedias ni publicidad invasiva.</p>
                  </div>
                </div>
                <div className="d-flex align-items-start gap-3">
                  <div className="rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', background: '#fff', color: '#526b42' }}>
                    <i className="bi bi-shield-check fs-4" />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1" style={{ color: '#2d3a1c' }}>Validación web garantizada</h6>
                    <p className="small text-muted mb-0">Auto-normalización de URLs web seguras para evitar errores de tipeo y enlaces rotos.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 order-lg-1">
              <div className="p-4 rounded-4 shadow-sm bg-white border">
                <div className="mb-3 d-flex align-items-center justify-content-between">
                  <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-1">Enlace Activo</span>
                  <small className="text-muted"><i className="bi bi-cursor-fill me-1" /> 1 clic registrado</small>
                </div>
                <div className="p-3 rounded-3 border bg-light mb-3">
                  <small className="text-muted d-block">URL Larga Original:</small>
                  <span className="font-monospace text-muted small text-break">https://youtube.com/watch?v=Tu7oq3VNgpY</span>
                </div>
                <div className="text-center my-2">
                  <i className="bi bi-arrow-down fs-4 text-muted" />
                </div>
                <div className="p-3 rounded-3 border border-success bg-white mb-3 text-center">
                  <small className="text-muted d-block mb-1">Enlace Corto QRedirect:</small>
                  <strong className="fs-5 font-monospace text-primary">qredirect.com/s/mi-cancion/</strong>
                </div>
                <div className="d-flex gap-2">
                  <button type="button" className="btn auth-submit w-100 btn-sm">
                    <i className="bi bi-clipboard me-1" /> Copiar Enlace Corto
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature 3: Analíticas en Tiempo Real */}
        <section className="container mb-5 py-4">
          <div className="text-center mb-5">
            <span className="text-uppercase fw-bold" style={{ color: '#526b42', letterSpacing: '1px', fontSize: '0.85rem' }}>
              MÉTRICAS DETALLADAS
            </span>
            <h2 className="display-6 fw-bold mt-2 mb-3" style={{ color: '#2d3a1c' }}>
              Analíticas de Escaneo y Clics en Tiempo Real
            </h2>
            <p className="lead mx-auto" style={{ maxWidth: '650px', color: '#65675e', fontSize: '1.05rem' }}>
              Cada vez que alguien escanea uno de tus códigos QR o ingresa a tu enlace corto, el sistema captura automáticamente datos enriquecidos para entender a tu audiencia.
            </p>
          </div>

          <div className="row g-4">
            {analyticsFeatures.map((item, index) => (
              <div className="col-md-4 col-sm-6" key={index}>
                <div className="p-4 rounded-4 bg-white border h-100 shadow-sm" style={{ transition: 'transform 0.2s' }}>
                  <div className="d-inline-flex p-3 rounded-circle mb-3" style={{ background: '#eef3eb', color: '#405139' }}>
                    <i className={`bi ${item.icon} fs-3`} />
                  </div>
                  <h5 className="fw-bold mb-2" style={{ color: '#2d3a1c' }}>{item.title}</h5>
                  <p className="text-muted mb-0 small" style={{ lineHeight: '1.6' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Feature 4: Control, Gestión y Seguridad */}
        <section className="container mb-5 py-4">
          <div className="p-5 rounded-4 border bg-white shadow-sm">
            <div className="row align-items-center g-4">
              <div className="col-lg-7">
                <span className="badge bg-secondary-subtle text-secondary px-3 py-1 mb-2">CONTROL TOTAL</span>
                <h3 className="fw-bold mb-3" style={{ color: '#2d3a1c' }}>
                  Pausa tus campañas cuando quieras y gestiona todo en un solo lugar
                </h3>
                <p className="text-muted mb-4" style={{ lineHeight: '1.7' }}>
                  ¿Terminó una promoción o necesitas pausar temporalmente una campaña? 
                  Con el interruptor de estado <code>is_active</code> podés inhabilitar el acceso al instante sin borrar el código.
                  Tus datos están protegidos mediante autenticación robusta con tokens JWT y permisos estrictos por propietario.
                </p>
                <div className="d-flex flex-wrap gap-4">
                  <div>
                    <i className="bi bi-shield-lock-fill text-success fs-4 me-2" />
                    <strong>Tokens JWT seguros</strong>
                  </div>
                  <div>
                    <i className="bi bi-toggle-on text-primary fs-4 me-2" />
                    <strong>Interruptor On/Off inmediato</strong>
                  </div>
                  <div>
                    <i className="bi bi-person-badge text-secondary fs-4 me-2" />
                    <strong>Privacidad de tus datos</strong>
                  </div>
                </div>
              </div>
              <div className="col-lg-5 text-center">
                <div className="p-4 rounded-4 border" style={{ background: '#faf8f5' }}>
                  <i className="bi bi-sliders fs-1" style={{ color: '#526b42' }} />
                  <h5 className="fw-bold mt-2 mb-1" style={{ color: '#2d3a1c' }}>Panel de Control Simple</h5>
                  <p className="small text-muted mb-3">Administrá todos tus QRs y enlaces en segundos sin configuraciones complejas.</p>
                  <Link to="/crear-qr" className="btn auth-submit w-100 btn-sm">
                    Comenzar Ahora
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="container text-center py-5">
          <div className="p-5 rounded-4 shadow" style={{ background: '#344228', color: '#fff' }}>
            <h2 className="display-6 fw-bold mb-3">¿Listo para conectar con tu audiencia?</h2>
            <p className="lead mx-auto mb-4 opacity-75" style={{ maxWidth: '600px' }}>
              Comenzá hoy a crear códigos QR dinámicos y enlaces cortos con estadísticas profesionales.
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Link to="/crear-qr" className="btn btn-light px-4 py-2 fw-bold" style={{ color: '#344228', borderRadius: '0.6rem' }}>
                Crear QR Gratis
              </Link>
              <Link to="/acortar-link" className="btn btn-outline-light px-4 py-2 fw-bold" style={{ borderRadius: '0.6rem' }}>
                Acortar Enlace
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
