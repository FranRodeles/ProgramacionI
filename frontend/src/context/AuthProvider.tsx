import { useCallback, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { AuthContext } from './AuthContext'
import type { User, RegisterData, SessionUser, AuthResult } from './AuthContext'

const INITIAL_USERS: User[] = [
  { id: 1, name: 'Administrador', email: 'admin@qredirect.com', username: 'admin', password: 'admin' },
]

const MIN_PASSWORD_LENGTH = 8

function toSessionUser(user: User): SessionUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    username: user.username,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS)
  const [user, setUser] = useState<SessionUser | null>(null)

  const usersRef = useRef<User[]>(INITIAL_USERS)
  const nextIdRef = useRef<number>(INITIAL_USERS.length + 1)

  usersRef.current = users

  const login = useCallback((username: string, password: string): AuthResult => {
    const found = usersRef.current.find((u) => u.username === username && u.password === password)
    if (!found) {
      return { success: false, error: 'Usuario o contraseña incorrectos' }
    }
    setUser(toSessionUser(found))
    return { success: true }
  }, [])

  const register = useCallback((data: RegisterData): AuthResult => {
    if (usersRef.current.some((u) => u.username === data.username)) {
      return { success: false, error: 'El nombre de usuario ya está en uso' }
    }
    if (usersRef.current.some((u) => u.email === data.email)) {
      return { success: false, error: 'El email ya está registrado' }
    }
    if (data.password.length < MIN_PASSWORD_LENGTH) {
      return { success: false, error: `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres` }
    }

    const newUser: User = { ...data, id: nextIdRef.current }
    nextIdRef.current += 1

    setUsers((prev) => [...prev, newUser])
    setUser(toSessionUser(newUser))
    return { success: true }
  }, [])

  const logout = useCallback(() => setUser(null), [])

  const value = useMemo(
    () => ({ user, login, register, logout }),
    [user, login, register, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
