import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../context/AuthProvider'
import Register from './Register'
import { jsonResponse, tokenBody, profileBody } from '../test/helpers'

function renderRegister() {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/register']}>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<div>HOME</div>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  )
}

async function fillForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Nombre'), 'Juan')
  await user.type(screen.getByLabelText('Apellido'), 'Pérez')
  await user.type(screen.getByLabelText('Email'), 'juan@test.com')
  await user.type(screen.getByLabelText('Usuario'), 'juan')
  await user.type(screen.getByLabelText('Contraseña'), 'password123')
}

describe('Register', () => {
  it('redirige a Home tras registrarse', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input)
        const method = init?.method ?? 'GET'
        if (url.endsWith('/api/users/') && method === 'POST') return jsonResponse(profileBody, 201)
        if (url.endsWith('/api/token/')) return jsonResponse(tokenBody, 200)
        if (url.endsWith('/api/users/profile/')) return jsonResponse(profileBody, 200)
        return jsonResponse({}, 404)
      })
    )

    renderRegister()
    const user = userEvent.setup()
    await fillForm(user)
    await user.click(screen.getByRole('button', { name: /registrarse/i }))

    expect(await screen.findByText('HOME')).toBeInTheDocument()
  })

  it('muestra error si el usuario ya existe', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => jsonResponse({ username: ['A user with that username already exists.'] }, 400))
    )

    renderRegister()
    const user = userEvent.setup()
    await fillForm(user)
    await user.click(screen.getByRole('button', { name: /registrarse/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent('El nombre de usuario ya está en uso')
  })
})
