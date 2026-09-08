import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { createQr, patchQr } from '../api/qr'
import type { QRCodeData } from '../api/qr'
import QrPreview from '../components/qr/QrPreview'
import type QRCodeStyling from 'qr-code-styling'

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

export default function CreateQr() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [qrCode, setQrCode] = useState<QRCodeData | null>(null)

  // Step 1 Data
  const [name, setName] = useState('')
  const [type, setType] = useState('WEB')
  const [value, setValue] = useState('')
  const [slug, setSlug] = useState('')

  // Step 2 Data
  const [dotStyle, setDotStyle] = useState('square')
  const [cornerStyle, setCornerStyle] = useState('square')
  const [dotColor, setDotColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [logo, setLogo] = useState<string>('')
  
  const qrCodeRef = useRef<QRCodeStyling | null>(null)

  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const formattedSlug = slug.trim() ? slugify(slug) : undefined
      const created = await createQr({
        name,
        destination_type: type,
        destination_value: value,
        slug: formattedSlug,
        is_active: false,
      })
      setQrCode(created)
      setStep(2)
    } catch (err: any) {
      setError(err.message || 'Error creando QR')
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (evt) => {
      setLogo(evt.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!qrCode) return
    setError('')
    setLoading(true)
    try {
      const customization = {
        dot_style: dotStyle,
        corner_style: cornerStyle,
        dot_color: dotColor,
        background_color: bgColor,
        logo
      }
      const updated = await patchQr(qrCode.id, { customization })
      setQrCode(updated)
      setStep(3)
    } catch (err: any) {
      setError(err.message || 'Error guardando diseño')
    } finally {
      setLoading(false)
    }
  }

  const handleStep3 = async () => {
    if (!qrCode) return
    setError('')
    setLoading(true)
    try {
      await patchQr(qrCode.id, { is_active: true })
      setStep(4) // success view
    } catch (err: any) {
      setError(err.message || 'Error activando QR')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (qrCodeRef.current) {
      qrCodeRef.current.download({ name: qrCode?.slug || 'qr', extension: 'png' })
    }
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
        
        {step === 1 && (
          <form onSubmit={handleStep1}>
            <h1 className="auth-title">Crear Nuevo QR</h1>
            <p className="auth-subtitle">Paso 1: Datos básicos</p>
            {error && <div className="alert alert-danger auth-alert">{error}</div>}
            
            <div className="mb-3">
              <label className="form-label auth-label">Nombre del QR</label>
              <input type="text" className="form-control" required value={name} onChange={e => setName(e.target.value)} placeholder="Ej: Mi web" />
            </div>
            <div className="mb-3">
              <label className="form-label auth-label">Tipo de Destino</label>
              <select className="form-control" value={type} onChange={e => setType(e.target.value)}>
                <option value="WEB">Sitio Web</option>
                <option value="EMAIL">Email</option>
                <option value="PHONE">Teléfono</option>
                <option value="WHATSAPP">WhatsApp</option>
                <option value="MAP">Mapa</option>
                <option value="TEXT">Texto</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label auth-label">Valor del Destino</label>
              <input type="text" className="form-control" required value={value} onChange={e => setValue(e.target.value)} placeholder="https://ejemplo.com" />
            </div>
            <div className="mb-4">
              <label className="form-label auth-label">Enlace personalizado (Opcional)</label>
              <input
                type="text"
                className="form-control"
                value={slug}
                onChange={e => setSlug(e.target.value)}
                onBlur={() => {
                  if (slug.trim()) {
                    setSlug(slugify(slug))
                  }
                }}
                placeholder="Ej: mi-menu o Mi Negocio"
              />
              <div className="form-text mt-1 text-muted" style={{ fontSize: '0.85rem' }}>
                {slug.trim() ? (
                  <span>
                    Vista previa del enlace:{' '}
                    <strong className="text-primary font-monospace">
                      /q/{slugify(slug)}/
                    </strong>
                  </span>
                ) : (
                  'Podés escribir con espacios; se convertirán automáticamente en guiones. Si lo dejás en blanco se generará un código automático.'
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
              <button type="submit" className="btn auth-submit w-50" disabled={loading}>
                {loading ? 'Creando...' : 'Siguiente: Diseño'}
              </button>
            </div>
          </form>
        )}

        {step === 2 && qrCode && (
          <form onSubmit={handleStep2}>
            <h1 className="auth-title">Personalizar QR</h1>
            <p className="auth-subtitle">Paso 2: Dale tu estilo</p>
            {error && <div className="alert alert-danger auth-alert">{error}</div>}

            <QrPreview 
              data={qrCode.qr_redirect_url} 
              customization={{
                dot_style: dotStyle,
                corner_style: cornerStyle,
                dot_color: dotColor,
                background_color: bgColor,
                logo
              }} 
            />

            <div className="row mt-3">
              <div className="col-6 mb-3">
                <label className="form-label auth-label">Forma de puntos</label>
                <select className="form-control" value={dotStyle} onChange={e => setDotStyle(e.target.value)}>
                  <option value="square">Cuadrados</option>
                  <option value="dots">Puntos</option>
                  <option value="rounded">Redondeados</option>
                  <option value="classy">Clásico</option>
                  <option value="classy-rounded">Clásico Redondeado</option>
                  <option value="extra-rounded">Súper Redondeado</option>
                </select>
              </div>
              <div className="col-6 mb-3">
                <label className="form-label auth-label">Forma de esquinas</label>
                <select className="form-control" value={cornerStyle} onChange={e => setCornerStyle(e.target.value)}>
                  <option value="square">Cuadrados</option>
                  <option value="dot">Punto</option>
                  <option value="extra-rounded">Redondeado</option>
                </select>
              </div>
            </div>

            <div className="row">
              <div className="col-6 mb-3">
                <label className="form-label auth-label">Color del QR</label>
                <input type="color" className="form-control form-control-color w-100" value={dotColor} onChange={e => setDotColor(e.target.value)} />
              </div>
              <div className="col-6 mb-3">
                <label className="form-label auth-label">Color de fondo</label>
                <input type="color" className="form-control form-control-color w-100" value={bgColor} onChange={e => setBgColor(e.target.value)} />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label auth-label">Logo (Opcional)</label>
              <input type="file" className="form-control" accept="image/*" onChange={handleFileChange} />
            </div>

            <div className="d-flex gap-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn btn-outline-secondary w-50"
                style={{ borderRadius: '0.6rem', fontWeight: 600, padding: '0.7rem 1.25rem' }}
              >
                Volver
              </button>
              <button type="submit" className="btn auth-submit w-50" disabled={loading}>
                {loading ? 'Guardando...' : 'Siguiente: Confirmar'}
              </button>
            </div>
          </form>
        )}

        {step === 3 && qrCode && (
          <div>
            <h1 className="auth-title">Confirmar</h1>
            <p className="auth-subtitle">Paso 3: Activar QR</p>
            {error && <div className="alert alert-danger auth-alert">{error}</div>}

            <QrPreview 
              data={qrCode.qr_redirect_url} 
              customization={qrCode.customization} 
            />
            
            <p className="text-center mt-3 mb-4">
              <strong>URL corta:</strong> <br />
              <a href={qrCode.qr_redirect_url} target="_blank" rel="noreferrer" className="auth-link">{qrCode.qr_redirect_url}</a>
            </p>

            <div className="d-flex gap-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="btn btn-outline-secondary w-50"
                style={{ borderRadius: '0.6rem', fontWeight: 600, padding: '0.7rem 1.25rem' }}
                disabled={loading}
              >
                Volver
              </button>
              <button onClick={handleStep3} className="btn auth-submit w-50" disabled={loading}>
                {loading ? 'Activando...' : 'Activar y Finalizar'}
              </button>
            </div>
          </div>
        )}

        {step === 4 && qrCode && (
          <div className="text-center">
            <h1 className="auth-title">¡QR Creado!</h1>
            <p className="auth-subtitle">Tu código está listo y activo</p>

            <QrPreview 
              data={qrCode.qr_redirect_url} 
              customization={qrCode.customization} 
              qrCodeRef={qrCodeRef}
            />

            <div className="d-flex gap-2 justify-content-center mt-4">
              <button onClick={handleDownload} className="btn auth-submit">
                Descargar PNG
              </button>
              <button onClick={() => {
                navigator.clipboard.writeText(qrCode.qr_redirect_url)
                alert('URL copiada al portapapeles')
              }} className="btn btn-outline-secondary">
                Copiar URL
              </button>
            </div>
            
            <div className="mt-4">
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
