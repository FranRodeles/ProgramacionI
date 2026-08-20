const steps = [
  ['bi-qr-code', 'Crea tu QR', 'Genera tu código en segundos'],
  ['bi-link-45deg', 'Personalízalo', 'Dale tu toque personal y hazlo único'],
  ['bi-bar-chart', 'Analiza resultados', 'Obtén estadísticas en tiempo real'],
  ['bi-arrow-repeat', 'Cambia el destino', 'Puedes cambiar el destino en cualquier momento'],
]

function HowItWorks() {
  return (
    <section id="caracteristicas" className="how-it-works-section py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="section-title display-5 fw-bold mb-3">
            <i className="bi bi-leaf-fill section-leaf" /> Así de fácil <i className="bi bi-leaf-fill section-leaf section-leaf-right" />
          </h2>
        </div>
        <div className="steps-row row g-4 position-relative">
          <svg className="connection-lines d-none d-lg-block position-absolute" viewBox="0 0 1000 140" preserveAspectRatio="none" aria-hidden="true">
            <path className="connection-base" d="M 160 52 C 180 4 218 4 230 52 C 242 100 280 100 300 52" />
            <path className="connection-base" d="M 460 52 C 472 24 488 24 500 52 C 512 80 528 80 540 52" />
            <path className="connection-base" d="M 700 52 C 720 4 748 4 760 52 C 772 100 820 100 840 52" />
            <circle className="connection-node" cx="160" cy="52" r="4" />
            <circle className="connection-node" cx="300" cy="52" r="4" />
            <circle className="connection-node" cx="460" cy="52" r="4" />
            <circle className="connection-node" cx="540" cy="52" r="4" />
            <circle className="connection-node" cx="700" cy="52" r="4" />
            <circle className="connection-node" cx="840" cy="52" r="4" />
            <circle className="thread-runner" r="5">
              <animateMotion dur="8.4s" repeatCount="indefinite" calcMode="linear" keyPoints="0;1;1;1" keyTimes="0;.31;.32;1" path="M 160 52 C 180 4 218 4 230 52 C 242 100 280 100 300 52" />
              <animate attributeName="opacity" dur="8.4s" repeatCount="indefinite" values="1;1;0;0" keyTimes="0;.31;.32;1" />
            </circle>
            <circle className="thread-runner" r="5">
              <animateMotion dur="8.4s" repeatCount="indefinite" calcMode="linear" keyPoints="0;0;1;1;1" keyTimes="0;.333;.643;.653;1" path="M 460 52 C 472 24 488 24 500 52 C 512 80 528 80 540 52" />
              <animate attributeName="opacity" dur="8.4s" repeatCount="indefinite" values="0;0;1;1;0;0" keyTimes="0;.323;.333;.643;.653;1" />
            </circle>
            <circle className="thread-runner" r="5">
              <animateMotion dur="8.4s" repeatCount="indefinite" calcMode="linear" keyPoints="0;0;0;1;1" keyTimes="0;.666;.676;.976;1" path="M 700 52 C 720 4 748 4 760 52 C 772 100 820 100 840 52" />
              <animate attributeName="opacity" dur="8.4s" repeatCount="indefinite" values="0;0;1;1;0" keyTimes="0;.656;.666;.976;1" />
            </circle>
          </svg>
          {steps.map(([icon, title, description], index) => (
            <div key={title} className={`step-column step-column-${index + 1} col-6 col-lg-3`}>
              <div className="how-card h-100 card border-0 text-center position-relative">
                <div className="card-body p-4">
                  <div className="step-number mb-3">{index + 1}</div>
                  <div className="step-icon rounded-circle d-inline-flex align-items-center justify-content-center mb-3"><i className={`bi ${icon}`} /></div>
                  <h5 className="card-title fw-bold">{title}</h5>
                  <p className="card-text">{description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
