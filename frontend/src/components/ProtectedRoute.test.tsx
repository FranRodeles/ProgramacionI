import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../context/AuthProvider'
import ProtectedRoute from './ProtectedRoute'
import { jsonResponse, profileBody } from '../test/helpers'

function renderProtected() {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<ProtectedRoute><div>SECRET</div></ProtectedRoute>} />
          <Route path="/login" element={<div>LOGIN</div>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  )
}

describe('ProtectedRoute', () => {
  it('redirige a /login si no hay sesión', async () => {
    renderProtected()

    expect(await screen.findByText('LOGIN')).toBeInTheDocument()
    expect(screen.queryByText('SECRET')).not.toBeInTheDocument()
  })

  it('muestra el contenido si hay sesión', async () => {
    localStorage.setItem('access_token', 'access-token')
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => jsonResponse(profileBody, 200))
    )

    renderProtected()

    expect(await screen.findByText('SECRET')).toBeInTheDocument()
  })
})
