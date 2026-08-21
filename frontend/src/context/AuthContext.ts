import { createContext } from 'react'

export interface User {
  id: number
  name: string
  email: string
  username: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  username: string
  password: string
}

export interface AuthContextValue {
  user: User | null
  login: (username: string, password: string) => boolean
  register: (data: RegisterData) => boolean
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
