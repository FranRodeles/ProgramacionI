import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/useAuth'
import { fetchUserQrs, patchQr, deleteQr, fetchQrAnalytics } from '../api/qr'
import type { QRCodeData, ResourceAnalytics } from '../api/qr'
import { apiFetch } from '../api/client'
import { fetchUserShortUrls, patchShortUrl, deleteShortUrl, fetchShortUrlAnalytics } from '../api/shortUrl'
import type { ShortUrlData } from '../api/shortUrl'

type SortOption = 'default' | 'interactions_desc' | 'interactions_asc' | 'date_desc' | 'date_asc'

export default function MyLinks() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'qr' | 'short'>('qr')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [qrs, setQrs] = useState<QRCodeData[]>([])
  const [shortUrls, setShortUrls] = useState<ShortUrlData[]>([])

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState<SortOption>('default')

  // Copy feedback state: key = 'qr-1' or 'short-1'
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  // Analytics modal state
  const [analyticsLoading, setAnalyticsLoading] = useState(false)
  const [analyticsData, setAnalyticsData] = useState<ResourceAnalytics | null>(null)
  const [analyticsType, setAnalyticsType] = useState<'QR' | 'Enlace' | null>(null)

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      const [qrsData, shortsData] = await Promise.all([
        fetchUserQrs(),
        fetchUserShortUrls(),
      ])
      const qrsList = Array.isArray(qrsData) ? qrsData : (qrsData as any)?.results || []
      const shortsList = Array.isArray(shortsData) ? shortsData : (shortsData as any)?.results || []
      setQrs(qrsList)
      setShortUrls(shortsList)
    } catch (err: any) {
      setError(err.message || 'Error al cargar los datos')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadPng = async (qr: QRCodeData) => {
    try {
      const res = await apiFetch(`/api/qr/${qr.id}/image/`, { method: 'GET' })
      if (!res.ok) throw new Error('Error al descargar la imagen')
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${qr.slug}.png`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (err: any) {
      alert(err.message || 'No se pudo descargar el QR')
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const handleToggleQr = async (qr: QRCodeData) => {
    try {
      const updated = await patchQr(qr.id, { is_active: !qr.is_active })
      setQrs(qrs.map((item) => (item.id === qr.id ? updated : item)))
    } catch (err: any) {
      alert(err.message || 'No se pudo cambiar el estado del QR')
    }
  }

  const handleToggleShort = async (short: ShortUrlData) => {
    try {
      const updated = await patchShortUrl(short.id, { is_active: !short.is_active })
      setShortUrls(shortUrls.map((item) => (item.id === short.id ? updated : item)))
    } catch (err: any) {
      alert(err.message || 'No se pudo cambiar el estado del enlace')
    }
  }

  const handleDeleteQr = async (id: number) => {
    if (!window.confirm('¿Seguro que querés eliminar este código QR? Esta acción no se puede deshacer.')) return
    try {
      await deleteQr(id)
      setQrs(qrs.filter((item) => item.id !== id))
    } catch (err: any) {
      alert(err.message || 'Error al eliminar el código QR')
    }
  }

  const handleDeleteShort = async (id: number) => {
    if (!window.confirm('¿Seguro que querés eliminar este enlace acortado?')) return
    try {
      await deleteShortUrl(id)
      setShortUrls(shortUrls.filter((item) => item.id !== id))
    } catch (err: any) {
      alert(err.message || 'Error al eliminar el enlace acortado')
    }
  }

  const openQrAnalytics = async (qr: QRCodeData) => {
    setAnalyticsType('QR')
    setAnalyticsLoading(true)
    setAnalyticsData(null)
    try {
      const data = await fetchQrAnalytics(qr.id)
      setAnalyticsData(data)
    } catch (err: any) {
      alert(err.message || 'Error al cargar estadísticas')
      setAnalyticsType(null)
    } finally {
      setAnalyticsLoading(false)
    }
  }

  const openShortAnalytics = async (short: ShortUrlData) => {
    setAnalyticsType('Enlace')
    setAnalyticsLoading(true)
    setAnalyticsData(null)
    try {
      const data = await fetchShortUrlAnalytics(short.id)
      setAnalyticsData(data)
    } catch (err: any) {
      alert(err.message || 'Error al cargar estadísticas')
      setAnalyticsType(null)
    } finally {
      setAnalyticsLoading(false)
    }
  }

  const totalScans = Array.isArray(qrs) ? qrs.reduce((acc, curr) => acc + (curr?.total_scans || 0), 0) : 0
  const totalClicks = Array.isArray(shortUrls) ? shortUrls.reduce((acc, curr) => acc + (curr?.total_clicks || 0), 0) : 0

  const filteredQrs = qrs
    .filter((qr) => {
      if (!searchQuery.trim()) return true
      const query = searchQuery.trim().toLowerCase()
      return (qr.name || '').toLowerCase().includes(query)
    })
    .sort((a, b) => {
      if (sortOption === 'interactions_desc') {
        return (b.total_scans || 0) - (a.total_scans || 0)
      }
      if (sortOption === 'interactions_asc') {
        return (a.total_scans || 0) - (b.total_scans || 0)
      }
      if (sortOption === 'date_asc') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      }
      // 'default' and 'date_desc'
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

  const filteredShortUrls = shortUrls
    .filter((short) => {
      if (!searchQuery.trim()) return true
      const query = searchQuery.trim().toLowerCase()
      return (short.name || '').toLowerCase().includes(query)
    })
    .sort((a, b) => {
      if (sortOption === 'interactions_desc') {
        return (b.total_clicks || 0) - (a.total_clicks || 0)
      }
      if (sortOption === 'interactions_asc') {
        return (a.total_clicks || 0) - (b.total_clicks || 0)
      }
      if (sortOption === 'date_asc') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      }
      // 'default' and 'date_desc'
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ background: '#fcfbf9' }}>
      <Navbar />

      <main className="flex-grow-1 py-4">
        <div className="container">
          {/* Header & Stats Banner */}
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 p-4 rounded-4 bg-white border shadow-sm">
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <h2 className="fw-bold mb-0" style={{ color: '#2d3a1c' }}>
                  Mis QR y Enlaces
                </h2>
                {user?.role === 'ADMIN' && (
                  <span className="badge bg-warning text-dark px-2 py-1">
                    <i className="bi bi-shield-shaded me-1" /> Administrador
                  </span>
                )}
              </div>
              <p className="text-muted mb-0 small">
                Gestioná tus códigos QR y enlaces cortos, monitoreá escaneos y analizá el impacto de tu contenido.
              </p>
            </div>
            <div className="d-flex gap-2">
              <Link to="/crear-qr" className="btn auth-submit btn-sm px-3">
                <i className="bi bi-plus-lg me-1" /> Nuevo QR
              </Link>
              <Link to="/acortar-link" className="btn btn-outline-secondary btn-sm px-3" style={{ borderRadius: '0.6rem', fontWeight: 600 }}>
                <i className="bi bi-link-45deg me-1" /> Acortar Link
              </Link>
            </div>
          </div>

          {/* Quick Stats Cards */}
          <div className="row g-3 mb-4">
            <div className="col-6 col-md-3">
              <div className="p-3 bg-white border rounded-3 text-center shadow-sm">
                <small className="text-muted d-block">Total de QRs</small>
                <span className="fs-3 fw-bold" style={{ color: '#526b42' }}>{qrs.length}</span>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-3 bg-white border rounded-3 text-center shadow-sm">
                <small className="text-muted d-block">Total Escaneos</small>
                <span className="fs-3 fw-bold text-success">{totalScans}</span>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-3 bg-white border rounded-3 text-center shadow-sm">
                <small className="text-muted d-block">Total Links Cortos</small>
                <span className="fs-3 fw-bold" style={{ color: '#405139' }}>{shortUrls.length}</span>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-3 bg-white border rounded-3 text-center shadow-sm">
                <small className="text-muted d-block">Total Clics</small>
                <span className="fs-3 fw-bold text-primary">{totalClicks}</span>
              </div>
            </div>
          </div>

          {/* Tabs Selector */}
          <div className="d-flex gap-2 border-bottom pb-2 mb-4">
            <button
              type="button"
              onClick={() => setActiveTab('qr')}
              className={`btn ${activeTab === 'qr' ? 'btn-dark' : 'btn-light border'} px-4 d-inline-flex align-items-center gap-2`}
              style={{
                borderRadius: '0.6rem',
                fontWeight: 600,
                background: activeTab === 'qr' ? '#405139' : '#fff',
                borderColor: activeTab === 'qr' ? '#405139' : '#dee2e6',
                color: activeTab === 'qr' ? '#fff' : '#495057',
              }}
            >
              <i className="bi bi-qr-code" /> Mis Códigos QR
              <span className={`badge ${activeTab === 'qr' ? 'bg-light text-dark' : 'bg-secondary-subtle text-secondary'} rounded-pill`}>
                {qrs.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('short')}
              className={`btn ${activeTab === 'short' ? 'btn-dark' : 'btn-light border'} px-4 d-inline-flex align-items-center gap-2`}
              style={{
                borderRadius: '0.6rem',
                fontWeight: 600,
                background: activeTab === 'short' ? '#405139' : '#fff',
                borderColor: activeTab === 'short' ? '#405139' : '#dee2e6',
                color: activeTab === 'short' ? '#fff' : '#495057',
              }}
            >
              <i className="bi bi-link-45deg" /> Mis Enlaces Acortados
              <span className={`badge ${activeTab === 'short' ? 'bg-light text-dark' : 'bg-secondary-subtle text-secondary'} rounded-pill`}>
                {shortUrls.length}
              </span>
            </button>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="bg-white p-3 rounded-4 border shadow-sm mb-4 d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div className="flex-grow-1" style={{ minWidth: '260px', maxWidth: '420px' }}>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <i className="bi bi-search" />
                </span>
                <input
                  type="text"
                  className="form-control bg-light border-start-0 ps-0"
                  placeholder={`Buscar ${activeTab === 'qr' ? 'código QR' : 'enlace'} por nombre...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="btn btn-light border border-start-0 text-muted"
                    onClick={() => setSearchQuery('')}
                    title="Limpiar búsqueda"
                  >
                    <i className="bi bi-x-circle" />
                  </button>
                )}
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <label htmlFor="sortSelect" className="small text-muted fw-semibold text-nowrap">
                <i className="bi bi-funnel me-1" /> Ordenar por:
              </label>
              <select
                id="sortSelect"
                className="form-select form-select-sm"
                style={{ width: 'auto', minWidth: '230px', borderRadius: '0.5rem', fontWeight: 500 }}
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
              >
                <option value="default">Predeterminado</option>
                <option value="interactions_desc">Más interacciones</option>
                <option value="interactions_asc">Menos interacciones</option>
                <option value="date_desc">Fecha de creación descendente</option>
                <option value="date_asc">Fecha de creación ascendente</option>
              </select>
            </div>
          </div>

          {/* Loading & Error Indicators */}
          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border qredirect-spinner" role="status" />
              <p className="mt-2 text-muted">Cargando tus enlaces...</p>
            </div>
          )}

          {error && <div className="alert alert-danger">{error}</div>}

          {/* Tab Content: QRs */}
          {!loading && activeTab === 'qr' && (
            <div>
              {qrs.length === 0 ? (
                <div className="text-center py-5 bg-white rounded-4 border p-5 shadow-sm">
                  <i className="bi bi-qr-code fs-1 text-muted d-block mb-3" />
                  <h4 className="fw-bold" style={{ color: '#2d3a1c' }}>Aún no creaste ningún código QR</h4>
                  <p className="text-muted mx-auto mb-4" style={{ maxWidth: '400px' }}>
                    Empezá ahora generando tu primer código QR dinámico para tu sitio web, WhatsApp, teléfono o redes.
                  </p>
                  <Link to="/crear-qr" className="btn auth-submit">
                    <i className="bi bi-plus-lg me-1" /> Crear mi primer QR
                  </Link>
                </div>
              ) : filteredQrs.length === 0 ? (
                <div className="text-center py-5 bg-white rounded-4 border p-5 shadow-sm">
                  <i className="bi bi-search fs-1 text-muted d-block mb-3" />
                  <h5 className="fw-bold" style={{ color: '#2d3a1c' }}>No se encontraron códigos QR</h5>
                  <p className="text-muted mx-auto mb-3" style={{ maxWidth: '400px' }}>
                    No hay códigos QR que coincidan con &quot;{searchQuery}&quot;.
                  </p>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setSearchQuery('')}
                  >
                    Limpiar búsqueda
                  </button>
                </div>
              ) : (
                <div className="row g-3">
                  {filteredQrs.map((qr) => {
                    const copyKey = `qr-${qr.id}`
                    return (
                      <div className="col-12" key={qr.id}>
                        <div className="p-4 bg-white border rounded-4 shadow-sm d-flex flex-wrap align-items-center justify-content-between gap-3">
                          <div className="d-flex align-items-center gap-3">
                            <div
                              className="rounded-3 d-flex align-items-center justify-content-center p-2 border"
                              style={{ width: '56px', height: '56px', background: '#eef3eb', color: '#405139', flexShrink: 0 }}
                            >
                              <i className="bi bi-qr-code fs-2" />
                            </div>
                            <div>
                              <div className="d-flex align-items-center gap-2 flex-wrap">
                                <h5 className="fw-bold mb-0" style={{ color: '#2d3a1c' }}>{qr.name}</h5>
                                <span className="badge bg-secondary-subtle text-secondary border small">
                                  {qr.destination_type}
                                </span>
                                <span
                                  className={`badge ${qr.is_active ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-danger-subtle text-danger border border-danger-subtle'}`}
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => handleToggleQr(qr)}
                                  title="Hacé clic para activar/desactivar"
                                >
                                  {qr.is_active ? '● Activo' : '○ Pausado'}
                                </span>
                              </div>
                              <div className="text-muted small mt-1">
                                Enlace corto:{' '}
                                <strong className="font-monospace text-primary">{qr.qr_redirect_url}</strong>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(qr.qr_redirect_url, copyKey)}
                                  className="btn btn-sm btn-link p-0 ms-2 text-decoration-none"
                                >
                                  <i className={`bi ${copiedKey === copyKey ? 'bi-check2 text-success' : 'bi-clipboard'}`} />{' '}
                                  {copiedKey === copyKey ? 'Copiado' : 'Copiar'}
                                </button>
                              </div>
                              <div className="text-muted small text-truncate" style={{ maxWidth: '400px' }}>
                                Destino: <span title={qr.destination_value}>{qr.destination_value}</span>
                              </div>
                            </div>
                          </div>

                          <div className="d-flex align-items-center gap-2 flex-wrap ms-auto">
                            <div className="text-center px-3 py-1 border rounded-3 bg-light me-2">
                              <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Escaneos</small>
                              <strong className="fs-6 text-success">{qr.total_scans}</strong>
                            </div>

                            <button
                              type="button"
                              onClick={() => openQrAnalytics(qr)}
                              className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1"
                              style={{ borderRadius: '0.5rem', fontWeight: 600 }}
                            >
                              <i className="bi bi-bar-chart-line" /> Analíticas
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDownloadPng(qr)}
                              className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1"
                              style={{ borderRadius: '0.5rem', fontWeight: 600 }}
                            >
                              <i className="bi bi-download" /> PNG
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteQr(qr.id)}
                              className="btn btn-outline-danger btn-sm"
                              style={{ borderRadius: '0.5rem' }}
                              title="Eliminar QR"
                            >
                              <i className="bi bi-trash3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Tab Content: ShortUrls */}
          {!loading && activeTab === 'short' && (
            <div>
              {shortUrls.length === 0 ? (
                <div className="text-center py-5 bg-white rounded-4 border p-5 shadow-sm">
                  <i className="bi bi-link-45deg fs-1 text-muted d-block mb-3" />
                  <h4 className="fw-bold" style={{ color: '#2d3a1c' }}>Aún no creaste ningún enlace acortado</h4>
                  <p className="text-muted mx-auto mb-4" style={{ maxWidth: '400px' }}>
                    Acortá tus URLs largas y obtené enlaces limpios con métricas de visitas en tiempo real.
                  </p>
                  <Link to="/acortar-link" className="btn auth-submit">
                    <i className="bi bi-plus-lg me-1" /> Acortar mi primer enlace
                  </Link>
                </div>
              ) : filteredShortUrls.length === 0 ? (
                <div className="text-center py-5 bg-white rounded-4 border p-5 shadow-sm">
                  <i className="bi bi-search fs-1 text-muted d-block mb-3" />
                  <h5 className="fw-bold" style={{ color: '#2d3a1c' }}>No se encontraron enlaces</h5>
                  <p className="text-muted mx-auto mb-3" style={{ maxWidth: '400px' }}>
                    No hay enlaces acortados que coincidan con &quot;{searchQuery}&quot;.
                  </p>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setSearchQuery('')}
                  >
                    Limpiar búsqueda
                  </button>
                </div>
              ) : (
                <div className="row g-3">
                  {filteredShortUrls.map((short) => {
                    const copyKey = `short-${short.id}`
                    return (
                      <div className="col-12" key={short.id}>
                        <div className="p-4 bg-white border rounded-4 shadow-sm d-flex flex-wrap align-items-center justify-content-between gap-3">
                          <div>
                            <div className="d-flex align-items-center gap-2 flex-wrap">
                              <h5 className="fw-bold mb-0" style={{ color: '#2d3a1c' }}>{short.name}</h5>
                              <span
                                className={`badge ${short.is_active ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-danger-subtle text-danger border border-danger-subtle'}`}
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleToggleShort(short)}
                                title="Hacé clic para activar/desactivar"
                              >
                                {short.is_active ? '● Activo' : '○ Pausado'}
                              </span>
                            </div>
                            <div className="text-muted small mt-1">
                              Enlace corto:{' '}
                              <strong className="font-monospace text-primary">{short.short_url}</strong>
                              <button
                                type="button"
                                onClick={() => handleCopy(short.short_url, copyKey)}
                                className="btn btn-sm btn-link p-0 ms-2 text-decoration-none"
                              >
                                <i className={`bi ${copiedKey === copyKey ? 'bi-check2 text-success' : 'bi-clipboard'}`} />{' '}
                                {copiedKey === copyKey ? 'Copiado' : 'Copiar'}
                              </button>
                            </div>
                            <div className="text-muted small text-truncate" style={{ maxWidth: '450px' }}>
                              Destino: <a href={short.original_url} target="_blank" rel="noreferrer" className="text-secondary">{short.original_url}</a>
                            </div>
                          </div>

                          <div className="d-flex align-items-center gap-2 flex-wrap ms-auto">
                            <div className="text-center px-3 py-1 border rounded-3 bg-light me-2">
                              <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Clics</small>
                              <strong className="fs-6 text-primary">{short.total_clicks}</strong>
                            </div>

                            <button
                              type="button"
                              onClick={() => openShortAnalytics(short)}
                              className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1"
                              style={{ borderRadius: '0.5rem', fontWeight: 600 }}
                            >
                              <i className="bi bi-bar-chart-line" /> Analíticas
                            </button>

                            <a
                              href={short.short_url}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1"
                              style={{ borderRadius: '0.5rem', fontWeight: 600 }}
                            >
                              <i className="bi bi-box-arrow-up-right" /> Probar
                            </a>

                            <button
                              type="button"
                              onClick={() => handleDeleteShort(short.id)}
                              className="btn btn-outline-danger btn-sm"
                              style={{ borderRadius: '0.5rem' }}
                              title="Eliminar enlace"
                            >
                              <i className="bi bi-trash3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Analytics Modal */}
      {analyticsType && (
        <div
          className="modal show d-block"
          tabIndex={-1}
          style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1060 }}
          role="dialog"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header border-bottom px-4 py-3">
                <div>
                  <h5 className="modal-title fw-bold" style={{ color: '#2d3a1c' }}>
                    <i className="bi bi-bar-chart-line-fill me-2 text-success" />
                    Estadísticas de {analyticsType}: {analyticsData?.name || 'Cargando...'}
                  </h5>
                  <small className="text-muted font-monospace">
                    /{analyticsType === 'QR' ? 'q' : 's'}/{analyticsData?.slug}/
                  </small>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setAnalyticsType(null)
                    setAnalyticsData(null)
                  }}
                  aria-label="Cerrar"
                />
              </div>

              <div className="modal-body p-4">
                {analyticsLoading && (
                  <div className="text-center py-4">
                    <div className="spinner-border qredirect-spinner" role="status" />
                    <p className="mt-2 text-muted">Cargando eventos...</p>
                  </div>
                )}

                {!analyticsLoading && analyticsData && (
                  <div>
                    {/* Summary badge */}
                    <div className="d-flex justify-content-between align-items-center p-3 mb-4 rounded-3 border bg-light">
                      <span>Total acumulado de interacciones:</span>
                      <span className="fs-5 fw-bold text-success">
                        {analyticsType === 'QR' ? analyticsData.total_scans : analyticsData.total_clicks}
                      </span>
                    </div>

                    <h6 className="fw-bold mb-3" style={{ color: '#2d3a1c' }}>
                      Detalle de visitas e interacciones (Información anónima)
                    </h6>

                    {analyticsData.events.length === 0 ? (
                      <div className="text-center py-4 text-muted">
                        <i className="bi bi-inbox fs-2 d-block mb-2 text-secondary opacity-50" />
                        Aún no se han registrado visitas o escaneos para este elemento.
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                          <thead className="table-light">
                            <tr className="small text-muted">
                              <th>Fecha y Hora</th>
                              <th>País y Ciudad</th>
                              <th>Dispositivo</th>
                              <th>Sistema Operativo</th>
                              <th>Navegador</th>
                            </tr>
                          </thead>
                          <tbody>
                            {analyticsData.events.map((event, idx) => {
                              const date = new Date(event.scanned_at || event.clicked_at || '')
                              return (
                                <tr key={idx} className="small">
                                  <td>
                                    {isNaN(date.getTime())
                                      ? 'Reciente'
                                      : date.toLocaleString('es-AR', {
                                          day: '2-digit',
                                          month: '2-digit',
                                          year: 'numeric',
                                          hour: '2-digit',
                                          minute: '2-digit',
                                        })}
                                  </td>
                                  <td>
                                    <i className="bi bi-geo-alt me-1 text-danger" />
                                    {event.country || 'Argentina'}{event.city ? `, ${event.city}` : ''}
                                  </td>
                                  <td>
                                    <span className="badge bg-light text-dark border">
                                      <i className={`bi ${event.device_type === 'Móvil' ? 'bi-phone' : event.device_type === 'Tablet' ? 'bi-tablet' : 'bi-laptop'} me-1`} />
                                      {event.device_type || 'Escritorio'}
                                    </span>
                                  </td>
                                  <td>{event.os || 'Desconocido'}</td>
                                  <td>{event.browser || 'Navegador'}</td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="modal-footer border-top px-4 py-3">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm px-3"
                  style={{ borderRadius: '0.5rem' }}
                  onClick={() => {
                    setAnalyticsType(null)
                    setAnalyticsData(null)
                  }}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
