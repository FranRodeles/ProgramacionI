import { createContext } from 'react'

export interface SessionUser {
  id: number
  username: string
  first_name: string
  last_name: string
  email: string
  role: string
}

export interface RegisterData {
  username: string
  first_name: string
  last_name: string
  email: string
  password: string
}

export type AuthResult = {
  success: boolean
  error?: string
}

export interface AuthContextValue {
  user: SessionUser | null
  loading: boolean
  login: (username: string, password: string) => Promise<AuthResult>
  register: (data: RegisterData) => Promise<AuthResult>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
