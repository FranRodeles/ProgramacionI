import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createShortUrl } from '../api/shortUrl'
import type { ShortUrlData } from '../api/shortUrl'

export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quita acentos y tildes
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-_]/g, '') // Permite solo caracteres alfanuméricos, espacios y guiones
    .replace(/[\s_]+/g, '-') // Reemplaza espacios y guiones bajos por guión medio
    .replace(/^-+|-+$/g, '') // Elimina guiones sobrantes al inicio o final
}

export default function ShortenUrl() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [createdData, setCreatedData] = useState<ShortUrlData | null>(null)

  // Form fields
  const [name, setName] = useState('')
  const [originalUrl, setOriginalUrl] = useState('')
  const [slug, setSlug] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      let targetUrl = originalUrl.trim()
      if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
        targetUrl = `https://${targetUrl}`
      }

      const formattedSlug = slug.trim() ? slugify(slug) : undefined
      const created = await createShortUrl({
        name: name.trim(),
        original_url: targetUrl,
        slug: formattedSlug,
        is_active: true,
      })
      setCreatedData(created)
    } catch (err: any) {
      setError(err.message || 'Error al acortar el enlace')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!createdData) return
    try {
      await navigator.clipboard.writeText(createdData.short_url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      alert('No se pudo copiar el enlace')
    }
  }

  const handleReset = () => {
    setName('')
    setOriginalUrl('')
    setSlug('')
    setCreatedData(null)
    setError('')
    setCopied(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="d-flex justify-content-start mb-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1"
            style={{ borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.85rem' }}
          >
            <i className="bi bi-arrow-left" /> Volver a la principal
          </button>
        </div>

        <img src="/logo_sin_fondo.png" alt="QRedirect" className="auth-logo" style={{ width: '100px' }} />

        {!createdData ? (
          <form onSubmit={handleSubmit}>
            <h1 className="auth-title">Acortar Enlace</h1>
            <p className="auth-subtitle">Creá un link corto y fácil de compartir</p>
            {error && <div className="alert alert-danger auth-alert">{error}</div>}

            <div className="mb-3">
              <label className="form-label auth-label">Nombre del enlace</label>
              <input
                type="text"
                className="form-control"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Mi tienda online"
              />
            </div>

            <div className="mb-3">
              <label className="form-label auth-label">URL de la página web</label>
              <input
                type="text"
                className="form-control"
                required
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                placeholder="https://ejemplo.com/pagina-larga"
              />
              <div className="form-text mt-1 text-muted" style={{ fontSize: '0.85rem' }}>
                Solo páginas web (ej: <code>https://tuweb.com</code> o <code>tuweb.com</code>).
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label auth-label">Enlace personalizado (Opcional)</label>
              <input
                type="text"
                className="form-control"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                onBlur={() => {
                  if (slug.trim()) {
                    setSlug(slugify(slug))
                  }
                }}
                placeholder="Ej: mi-tienda o Mi Promocion"
              />
              <div className="form-text mt-1 text-muted" style={{ fontSize: '0.85rem' }}>
                {slug.trim() ? (
                  <span>
                    Vista previa del enlace:{' '}
                    <strong className="text-primary font-monospace">
                      /s/{slugify(slug)}/
                    </strong>
                  </span>
                ) : (
                  'Podés usar espacios; se convertirán automáticamente en guiones. Si lo dejás en blanco se generará un código automático.'
                )}
              </div>
            </div>

            <div className="d-flex gap-2">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="btn btn-outline-secondary w-50"
                style={{ borderRadius: '0.6rem', fontWeight: 600, padding: '0.7rem 1.25rem' }}
              >
                Volver
              </button>
              <button
                type="submit"
                className="btn auth-submit w-50"
                disabled={loading}
              >
                {loading ? 'Acortando...' : 'Acortar enlace'}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center">
            <h1 className="auth-title">¡Enlace acortado!</h1>
            <p className="auth-subtitle">Tu enlace corto está listo para compartir</p>

            <div className="p-3 my-4 text-center rounded border bg-light">
              <div className="text-muted small mb-1 fw-semibold">Tu enlace corto:</div>
              <div className="fs-5 font-monospace fw-bold text-primary text-break mb-2">
                {createdData.short_url}
              </div>
              <div className="text-muted small text-truncate">
                Destino: <span className="font-monospace text-secondary" title={createdData.original_url}>{createdData.original_url}</span>
              </div>
            </div>

            <div className="d-flex gap-2 mb-3">
              <button
                type="button"
                onClick={handleCopy}
                className={`btn ${copied ? 'btn-success' : 'auth-submit'} w-50 d-inline-flex align-items-center justify-content-center gap-1`}
                style={{ borderRadius: '0.6rem', fontWeight: 600, padding: '0.7rem 1.25rem' }}
              >
                <i className={`bi ${copied ? 'bi-check-lg' : 'bi-clipboard'}`} />
                {copied ? '¡Copiado!' : 'Copiar link'}
              </button>
              <a
                href={createdData.short_url}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline-secondary w-50 d-inline-flex align-items-center justify-content-center gap-1"
                style={{ borderRadius: '0.6rem', fontWeight: 600, padding: '0.7rem 1.25rem' }}
              >
                <i className="bi bi-box-arrow-up-right" /> Probar link
              </a>
            </div>

            <div className="d-flex flex-column gap-2 mt-4">
              <button
                type="button"
                onClick={handleReset}
                className="btn btn-link auth-link text-decoration-none"
              >
                + Acortar otro enlace
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="btn btn-outline-secondary"
                style={{ borderRadius: '0.6rem', fontWeight: 600, padding: '0.6rem 1.25rem' }}
              >
                Volver al inicio
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
