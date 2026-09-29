import { apiFetch } from './client'

export interface ShortUrlData {
  id: number
  user_username: string
  name: string
  slug: string
  original_url: string
  short_url: string
  total_clicks: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export async function createShortUrl(data: {
  name: string
  original_url: string
  slug?: string
  is_active?: boolean
}): Promise<ShortUrlData> {
  const res = await apiFetch('/api/shorturl/', {
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
    throw new Error('Error al acortar el enlace')
  }
  return res.json() as Promise<ShortUrlData>
}

export async function fetchUserShortUrls(): Promise<ShortUrlData[]> {
  const res = await apiFetch('/api/shorturl/', { method: 'GET' })
  if (!res.ok) {
    throw new Error('Error al cargar los enlaces acortados')
  }
  const data = await res.json()
  return Array.isArray(data) ? data : (data.results || [])
}

export async function fetchShortUrlAnalytics(id: number) {
  const res = await apiFetch(`/api/shorturl/${id}/analytics/`, { method: 'GET' })
  if (!res.ok) {
    throw new Error('Error al cargar analíticas del enlace')
  }
  return res.json()
}

export async function patchShortUrl(id: number, data: Partial<ShortUrlData>): Promise<ShortUrlData> {
  const res = await apiFetch(`/api/shorturl/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    if (errorData.detail) throw new Error(errorData.detail)
    throw new Error('Error al actualizar el enlace')
  }
  return res.json() as Promise<ShortUrlData>
}

export async function deleteShortUrl(id: number): Promise<void> {
  const res = await apiFetch(`/api/shorturl/${id}/`, { method: 'DELETE' })
  if (!res.ok) {
    throw new Error('Error al eliminar el enlace acortado')
  }
}
