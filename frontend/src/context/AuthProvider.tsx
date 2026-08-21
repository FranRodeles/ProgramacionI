import { useState } from 'react'
import type { ReactNode } from 'react'
import { AuthContext } from './AuthContext'
import type { User, RegisterData } from './AuthContext'

const INITIAL_USERS: User[] = [
  { id: 1, name: 'Administrador', email: 'admin@qredirect.com', username: 'admin', password: 'admin' },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS)
  const [user, setUser] = useState<User | null>(null)

  const login = (username: string, password: string) => {
    const found = users.find((u) => u.username === username && u.password === password)
    if (!found) return false
    setUser(found)
    return true
  }

  const register = (data: RegisterData) => {
    if (users.some((u) => u.username === data.username)) return false
    const newUser: User = { ...data, id: users.length + 1 }
    setUsers((prev) => [...prev, newUser])
    setUser(newUser)
    return true
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
