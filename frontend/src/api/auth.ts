import { apiFetch } from './client'

export interface TokenResponse {
  access: string
  refresh: string
}

export interface ProfileResponse {
  id: number
  username: string
  first_name: string
  last_name: string
  email: string
  role: string
}

export interface RegisterPayload {
  username: string
  first_name: string
  last_name: string
  email: string
  password: string
}

export class ApiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

function extractFieldError(data: unknown): string {
  if (!data || typeof data !== 'object') return 'Error en el registro'
  const obj = data as Record<string, unknown>
  const key = Object.keys(obj)[0]
  if (!key) return 'Error en el registro'
  const value = obj[key]
  const message = Array.isArray(value) ? String(value[0]) : String(value)
  switch (key) {
    case 'username':
      return 'El nombre de usuario ya está en uso'
    case 'email':
      return 'El email ya está registrado'
    case 'password':
      return 'La contraseña no cumple los requisitos'
    default:
      return message
  }
}

export async function login(username: string, password: string): Promise<TokenResponse> {
  const res = await apiFetch(
    '/api/token/',
    { method: 'POST', body: JSON.stringify({ username, password }) },
    { auth: false }
  )
  if (res.status === 401) {
    throw new ApiError('Usuario o contraseña incorrectos')
  }
  if (!res.ok) {
    throw new ApiError('No se pudo iniciar sesión')
  }
  return (await res.json()) as TokenResponse
}

export async function register(payload: RegisterPayload): Promise<void> {
  const res = await apiFetch(
    '/api/users/',
    { method: 'POST', body: JSON.stringify(payload) },
    { auth: false }
  )
  if (res.status === 201) return
  const data = await res.json().catch(() => null)
  throw new ApiError(extractFieldError(data))
}

export async function logout(refresh: string): Promise<void> {
  await apiFetch('/api/logout/', { method: 'POST', body: JSON.stringify({ refresh }) })
}

export async function fetchProfile(): Promise<ProfileResponse> {
  const res = await apiFetch('/api/users/profile/')
  if (!res.ok) throw new ApiError('No se pudo obtener el perfil')
  return (await res.json()) as ProfileResponse
}
