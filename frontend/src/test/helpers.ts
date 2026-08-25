export function jsonResponse(body: unknown, status: number): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  } as unknown as Response
}

export const tokenBody = { access: 'access-token', refresh: 'refresh-token' }

export const profileBody = {
  id: 1,
  username: 'admin',
  first_name: 'Admin',
  last_name: 'Admin',
  email: 'admin@qredirect.com',
  role: 'ADMIN',
}
