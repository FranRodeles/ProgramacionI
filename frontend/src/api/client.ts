import { getAccessToken, getRefreshToken, setAccessToken, clearTokens } from './tokenStorage'

const BASE_URL: string = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000').replace(/\/+$/, '')

export class SessionExpiredError extends Error {
  constructor() {
    super('Sesión expirada')
    this.name = 'SessionExpiredError'
  }
}

export class NetworkError extends Error {
  constructor() {
    super('No se pudo conectar con el servidor')
    this.name = 'NetworkError'
  }
}

let refreshPromise: Promise<boolean> | null = null

async function doRefresh(): Promise<boolean> {
  const refresh = getRefreshToken()
  if (!refresh) return false
  try {
    const res = await fetch(`${BASE_URL}/api/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    })
    if (!res.ok) return false
    const data = (await res.json()) as { access?: string }
    if (!data.access) return false
    setAccessToken(data.access)
    return true
  } catch {
    return false
  }
}

function refreshAccessToken(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = doRefresh().finally(() => {
      refreshPromise = null
    })
  }
  return refreshPromise
}

interface ApiFetchOptions {
  auth?: boolean
  retried?: boolean
}

export async function apiFetch(
  path: string,
  options: RequestInit = {},
  apiOptions: ApiFetchOptions = {}
): Promise<Response> {
  const { auth = true, retried = false } = apiOptions

  const headers = new Headers(options.headers)
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  const access = auth ? getAccessToken() : null
  if (access) headers.set('Authorization', `Bearer ${access}`)

  let res: Response
  try {
    res = await fetch(`${BASE_URL}${path}`, { ...options, headers })
  } catch {
    throw new NetworkError()
  }

  if (auth && res.status === 401 && !retried) {
    const refreshed = await refreshAccessToken()
    if (refreshed) {
      return apiFetch(path, options, { auth, retried: true })
    }
    clearTokens()
    throw new SessionExpiredError()
  }

  return res
}
