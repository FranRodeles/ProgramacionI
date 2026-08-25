import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../context/AuthProvider'
import ProtectedRoute from './ProtectedRoute'

describe('ProtectedRoute', () => {
  it('redirige a /login si no hay sesión', async () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<ProtectedRoute><div>SECRET</div></ProtectedRoute>} />
            <Route path="/login" element={<div>LOGIN</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    )

    expect(await screen.findByText('LOGIN')).toBeInTheDocument()
    expect(screen.queryByText('SECRET')).not.toBeInTheDocument()
  })
})
