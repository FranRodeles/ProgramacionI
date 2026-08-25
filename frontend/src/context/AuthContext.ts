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

export type SessionUser = Omit<User, 'password'>

export type AuthResult = {
  success: boolean
  error?: string
}

export interface AuthContextValue {
  user: SessionUser | null
  login: (username: string, password: string) => AuthResult
  register: (data: RegisterData) => AuthResult
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
