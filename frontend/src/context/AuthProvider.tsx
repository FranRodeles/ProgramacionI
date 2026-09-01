import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { AuthContext } from './AuthContext'
import type { SessionUser, RegisterData, AuthResult } from './AuthContext'
import * as authApi from '../api/auth'
import { NetworkError } from '../api/client'
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '../api/tokenStorage'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function restore() {
      if (!getAccessToken()) {
        setLoading(false)
        return
      }
      try {
        const profile = await authApi.fetchProfile()
        if (!cancelled) setUser(profile)
      } catch (error) {
        if (!(error instanceof NetworkError)) {
          clearTokens()
        }
        if (!cancelled) setUser(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    restore()
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (username: string, password: string): Promise<AuthResult> => {
    try {
      const tokens = await authApi.login(username, password)
      setTokens(tokens.access, tokens.refresh)
      const profile = await authApi.fetchProfile()
      setUser(profile)
      return { success: true }
    } catch (error) {
      if (error instanceof authApi.ApiError) {
        return { success: false, error: error.message }
      }
      return { success: false, error: 'No se pudo conectar con el servidor' }
    }
  }, [])

  const register = useCallback(async (data: RegisterData): Promise<AuthResult> => {
    try {
      await authApi.register(data)
      return await login(data.username, data.password)
    } catch (error) {
      if (error instanceof authApi.ApiError) {
        return { success: false, error: error.message }
      }
      return { success: false, error: 'No se pudo conectar con el servidor' }
    }
  }, [login])

  const logout = useCallback(async (): Promise<void> => {
    const refresh = getRefreshToken()
    if (refresh) {
      try {
        await authApi.logout(refresh)
      } catch {
        // Si la API falla, igual limpiamos la sesión local.
      }
    }
    clearTokens()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading, login, register, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
