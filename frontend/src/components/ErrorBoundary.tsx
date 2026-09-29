import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center p-3" style={{ background: '#f7f5f0' }}>
          <div className="card shadow-sm p-4 text-center" style={{ maxWidth: '480px', borderRadius: '1rem' }}>
            <div className="mb-3 text-warning fs-1">
              <i className="bi bi-exclamation-triangle" />
            </div>
            <h3 className="fw-bold mb-2" style={{ color: '#2d3a1c' }}>Algo salió mal</h3>
            <p className="text-muted small mb-4">
              Ocurrió un error inesperado al cargar la sección. Podés regresar a la página principal.
            </p>
            <div className="d-flex justify-content-center gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => {
                  this.setState({ hasError: false, error: null })
                  window.location.href = '/'
                }}
              >
                Volver al inicio
              </button>
              <button
                type="button"
                className="btn btn-primary"
                style={{ background: '#405139', borderColor: '#405139' }}
                onClick={() => window.location.reload()}
              >
                Recargar página
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
