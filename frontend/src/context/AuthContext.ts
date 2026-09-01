import { createContext } from 'react'

export interface UserBase {
  username: string
  first_name: string
  last_name: string
  email: string
}

export interface SessionUser extends UserBase {
  id: number
  role: string
}

export interface RegisterData extends UserBase {
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
