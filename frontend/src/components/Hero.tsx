import '../styles/animations.css'

const qrCells = Array.from({ length: 441 }, (_, index) => {
  const row = Math.floor(index / 21)
  const column = index % 21
  const isFinderArea = (startRow: number, startColumn: number) =>
    row >= startRow && row < startRow + 7 && column >= startColumn && column < startColumn + 7

  if (isFinderArea(0, 0) || isFinderArea(0, 14) || isFinderArea(14, 0)) return false
  return (row * 7 + column * 11 + row * column) % 5 < 2
})

function DecorativeQr() {
  return (
    <div className="decorative-qr" aria-hidden="true">
      {qrCells.map((isDark, index) => <span key={index} className={isDark ? 'qr-cell qr-cell-dark' : 'qr-cell'} />)}
      <span className="qr-finder qr-finder-top-left" />
      <span className="qr-finder qr-finder-top-right" />
      <span className="qr-finder qr-finder-bottom-left" />
      <span className="qr-center-mark"><i className="bi bi-arrow-up-right" /></span>
    </div>
  )
}

function Hero() {
  return (
    <section id="inicio" className="hero-section">
      <div className="container py-5">
        <div className="row align-items-center">
          <div className="col-lg-6 mb-5 mb-lg-0">
            <div className="mb-4">
              <span className="hero-eyebrow">QR DINÁMICOS · ACORTA LINKS · ANALIZA</span>
            </div>
            <h1 className="hero-title mb-4">
              Crea códigos <span>QR dinámicos</span> al instante
            </h1>
            <p className="hero-copy mb-4">
              Genera, personaliza y analiza tus QR dinámicos. También acorta URL y lleva todo el control en un solo lugar
            </p>
            <div className="hero-action-group">
              <a className="btn hero-cta" href="#crear-qr">
                Crear mi primer QR <i className="bi bi-arrow-right ms-2" />
              </a>
              <span className="hero-note"><i className="bi bi-arrow-up-left" /> ¡Es gratis!</span>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="hero-visual">
              <div className="hero-orb hero-orb-back" />
              <div className="hero-orb hero-orb-front" />
              <div className="qr-frame"><DecorativeQr /></div>

              <div className="feature-float feature-float-link">
                <div className="feature-icon"><i className="bi bi-link-45deg" /></div>
                <div><strong>Acorta</strong><small>tus links</small></div>
              </div>
              <div className="feature-float feature-float-style">
                <div className="feature-icon"><i className="bi bi-palette" /></div>
                <div><strong>Personaliza</strong><small>a tu estilo</small></div>
              </div>
              <div className="feature-float feature-float-analysis">
                <div className="feature-icon"><i className="bi bi-bar-chart" /></div>
                <div><strong>Analiza</strong><small>en tiempo real</small></div>
              </div>

              <img className="hero-leaf hero-leaf-vertical" src="/leafe_removebg.png" alt="" aria-hidden="true" />
              <img className="hero-leaf hero-leaf-horizontal" src="/leafe_removebg.png" alt="" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
