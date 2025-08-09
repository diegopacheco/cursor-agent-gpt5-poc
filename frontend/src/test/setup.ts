import '@testing-library/jest-dom'
import { vi } from 'vitest'

vi.stubGlobal('fetch', async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = typeof input === 'string' ? input : input.toString()
  const method = (init?.method || 'GET').toUpperCase()
  const ok = (data: any, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })
  const no = (status = 204) => new Response(null as any, { status })
  if (url.includes('/members') && method === 'GET') return ok([])
  if (url.endsWith('/members') && method === 'POST') return ok({ id: 1 }, 201)
  if (url.includes('/teams/') && url.endsWith('/members') && method === 'GET') return ok([])
  if (url.includes('/teams/') && url.includes('/members/') && method === 'DELETE') return no(204)
  if (url.includes('/teams') && method === 'GET') return ok([])
  if (url.endsWith('/teams') && method === 'POST') return ok({ id: 1 }, 201)
  if (url.includes('/teams/') && method === 'DELETE') return no(204)
  if (url.includes('/assign') && method === 'POST') return no(204)
  if (url.includes('/feedback') && method === 'GET') return ok([])
  if (url.endsWith('/feedback') && method === 'POST') return ok({}, 201)
  return ok({})
})