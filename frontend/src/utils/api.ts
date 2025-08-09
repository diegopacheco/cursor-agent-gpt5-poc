const base = (() => {
  const env = (import.meta as any).env?.VITE_API_URL as string | undefined
  if (env) return env.replace(/\/$/, '')
  if (typeof window !== 'undefined') return `${window.location.protocol}//${window.location.hostname}:8080`
  return 'http://localhost:8080'
})()

async function j<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(`http ${res.status}`)
  if (res.status === 204) return undefined as unknown as T
  return res.json() as Promise<T>
}

export const api = {
  async getMembers() { return j<any[]>(await fetch(`${base}/members`)) },
  async createMember(body: { name: string; email: string; pictureUrl?: string }) { return j<{ id: number }>(await fetch(`${base}/members`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })) },
  async getTeams() { return j<any[]>(await fetch(`${base}/teams`)) },
  async createTeam(body: { name: string; logoUrl?: string }) { return j<{ id: number }>(await fetch(`${base}/teams`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })) },
  async deleteTeam(id: string | number) { return j<void>(await fetch(`${base}/teams/${id}`, { method: 'DELETE' })) },
  async getTeamMembers(teamId: string | number) { return j<any[]>(await fetch(`${base}/teams/${teamId}/members`)) },
  async removeTeamMember(teamId: string | number, memberId: string | number) { return j<void>(await fetch(`${base}/teams/${teamId}/members/${memberId}`, { method: 'DELETE' })) },
  async assign(body: { memberId: string | number; teamId: string | number }) { return j<void>(await fetch(`${base}/assign`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })) },
  async getFeedback(params?: { targetType?: string; targetId?: string | number }) {
    const q: string[] = []
    if (params?.targetType) q.push(`targetType=${encodeURIComponent(params.targetType)}`)
    if (params?.targetId) q.push(`targetId=${encodeURIComponent(String(params.targetId))}`)
    const qs = q.length ? `?${q.join('&')}` : ''
    return j<any[]>(await fetch(`${base}/feedback${qs}`))
  },
  async createFeedback(body: { targetType: 'member' | 'team'; targetId: string | number; content: string }) { return j<void>(await fetch(`${base}/feedback`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })) },
}
