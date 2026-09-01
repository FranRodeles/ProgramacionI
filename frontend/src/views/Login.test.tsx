import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../context/AuthProvider'
import Login from './Login'
import { jsonResponse, tokenBody, profileBody } from '../test/helpers'

function renderLogin() {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<div>HOME</div>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  )
}

describe('Login', () => {
  it('muestra error con credenciales inválidas', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse({ detail: 'No active account' }, 401)))

    renderLogin()
    const user = userEvent.setup()

    await user.type(screen.getByLabelText('Usuario'), 'nadie')
    await user.type(screen.getByLabelText('Contraseña'), 'incorrecta')
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Usuario o contraseña incorrectos')
  })

  it('redirige a Home con credenciales válidas', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input)
        if (url.endsWith('/api/token/')) return jsonResponse(tokenBody, 200)
        if (url.endsWith('/api/users/profile/')) return jsonResponse(profileBody, 200)
        return jsonResponse({}, 404)
      })
    )

    renderLogin()
    const user = userEvent.setup()

    await user.type(screen.getByLabelText('Usuario'), 'admin')
    await user.type(screen.getByLabelText('Contraseña'), 'admin')
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }))

    expect(await screen.findByText('HOME')).toBeInTheDocument()
  })
})
