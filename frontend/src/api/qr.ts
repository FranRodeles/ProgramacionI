import { apiFetch } from './client'

export interface QRCodeData {
  id: number
  user_username: string
  name: string
  slug: string
  destination_type: string
  destination_value: string
  is_active: boolean
  customization: any
  qr_redirect_url: string
  qr_image_url: string
  total_scans: number
  created_at: string
  updated_at: string
}

export async function createQr(data: {
  name: string
  destination_type: string
  destination_value: string
  slug?: string
  is_active?: boolean
}): Promise<QRCodeData> {
  const res = await apiFetch('/api/qr/', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    if (errorData.detail) {
      throw new Error(errorData.detail)
    }
    const errors = Object.values(errorData).flat()
    if (errors.length > 0 && typeof errors[0] === 'string') {
      throw new Error(errors.join(', '))
    }
    throw new Error('Error creando QR')
  }
  return res.json() as Promise<QRCodeData>
}

export async function patchQr(id: number, data: Partial<QRCodeData>): Promise<QRCodeData> {
  const res = await apiFetch(`/api/qr/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    if (errorData.detail) {
      throw new Error(errorData.detail)
    }
    const errors = Object.values(errorData).flat()
    if (errors.length > 0 && typeof errors[0] === 'string') {
      throw new Error(errors.join(', '))
    }
    throw new Error('Error actualizando QR')
  }
  return res.json() as Promise<QRCodeData>
}

export interface AnalyticsEvent {
  id: number
  scanned_at?: string
  clicked_at?: string
  country: string
  city: string
  device_type: string
  os: string
  browser: string
}

export interface ResourceAnalytics {
  id: number
  name: string
  slug: string
  total_scans?: number
  total_clicks?: number
  events: AnalyticsEvent[]
}

export async function fetchUserQrs(): Promise<QRCodeData[]> {
  const res = await apiFetch('/api/qr/', { method: 'GET' })
  if (!res.ok) {
    throw new Error('Error al cargar los códigos QR')
  }
  const data = await res.json()
  return Array.isArray(data) ? data : (data.results || [])
}

export async function fetchQrAnalytics(id: number): Promise<ResourceAnalytics> {
  const res = await apiFetch(`/api/qr/${id}/analytics/`, { method: 'GET' })
  if (!res.ok) {
    throw new Error('Error al cargar analíticas del QR')
  }
  return res.json() as Promise<ResourceAnalytics>
}

export async function deleteQr(id: number): Promise<void> {
  const res = await apiFetch(`/api/qr/${id}/`, { method: 'DELETE' })
  if (!res.ok) {
    throw new Error('Error al eliminar el código QR')
  }
}
