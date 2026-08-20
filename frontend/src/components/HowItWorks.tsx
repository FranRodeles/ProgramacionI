import { useEffect, useRef } from 'react'
import '../styles/animations.css'

function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const linesRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && linesRef.current) {
            const lines = linesRef.current.querySelectorAll('.draw-line')
            lines.forEach((line, index) => {
              setTimeout(() => {
                line.classList.add('animate')
              }, index * 300)
            })
          }
        })
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const steps = [
    {
      number: 1,
      icon: 'bi-qr-code',
      title: 'Crea tu QR',
      description: 'Genera tu código en segundos'
    },
    {
      number: 2,
      icon: 'bi-link-45deg',
      title: 'Personalízalo',
      description: 'Dale tu toque personal y hazlo único'
    },
    {
      number: 3,
      icon: 'bi-bar-chart',
      title: 'Analiza resultados',
      description: 'Obtén estadísticas en tiempo real'
    },
    {
      number: 4,
      icon: 'bi-arrow-repeat',
      title: 'Cambia el destino',
      description: 'Puedes cambiar el destino en cualquier momento'
    }
  ]

  return (
    <section ref={sectionRef} className="py-5" style={{ backgroundColor: '#fff' }}>
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold mb-3">
            <span style={{ color: '#4A5D23' }}>🌿</span>{' '}
            Así de fácil{' '}
            <span style={{ color: '#4A5D23' }}>🌿</span>
          </h2>
        </div>
        
        <div className="row g-4 position-relative">
          {/* SVG para hilos curvos animados */}
          <svg 
            ref={linesRef}
            className="d-none d-lg-block position-absolute" 
            style={{ 
              top: '50%', 
              left: '12%', 
              right: '12%', 
              height: '40px',
              width: '76%',
              zIndex: 0,
              overflow: 'visible'
            }}
          >
            {/* Hilo 1-2 */}
            <path 
              className="draw-line"
              d="M 0 20 Q 100 0, 200 20" 
              fill="none" 
              stroke="#4A5D23" 
              strokeWidth="2"
            />
            {/* Hilo 2-3 */}
            <path 
              className="draw-line"
              d="M 200 20 Q 300 40, 400 20" 
              fill="none" 
              stroke="#4A5D23" 
              strokeWidth="2"
            />
            {/* Hilo 3-4 */}
            <path 
              className="draw-line"
              d="M 400 20 Q 500 0, 600 20" 
              fill="none" 
              stroke="#4A5D23" 
              strokeWidth="2"
            />
          </svg>
          
          {steps.map((step) => (
            <div key={step.number} className="col-6 col-lg-3">
              <div 
                className="card h-100 border-0 shadow-sm text-center position-relative"
                style={{ 
                  borderRadius: '15px',
                  backgroundColor: '#fff',
                  zIndex: 1
                }}
              >
                <div className="card-body p-4">
                  {/* Número */}
                  <div 
                    className="mb-3"
                    style={{ 
                      fontSize: '2.5rem', 
                      fontWeight: 'bold',
                      color: '#C5CEB8'
                    }}
                  >
                    {step.number}
                  </div>
                  
                  {/* Ícono */}
                  <div 
                    className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ 
                      width: '60px', 
                      height: '60px', 
                      backgroundColor: '#E8E5DE'
                    }}
                  >
                    <i className={`bi ${step.icon}`} style={{ fontSize: '1.5rem', color: '#4A5D23' }}></i>
                  </div>
                  
                  {/* Título */}
                  <h5 className="card-title fw-bold" style={{ color: '#333' }}>
                    {step.title}
                  </h5>
                  
                  {/* Descripción */}
                  <p className="card-text" style={{ color: '#666', fontSize: '0.9rem' }}>
                    {step.description}
                  </p>
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
