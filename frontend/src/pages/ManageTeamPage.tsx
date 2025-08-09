import { useEffect, useState } from 'react'
import { api } from '../utils/api'
import { Button } from '../components/Button'

export default function ManageTeamPage() {
  const [teams, setTeams] = useState<any[]>([])
  const [membersByTeam, setMembersByTeam] = useState<Record<string, any[]>>({})

  async function load() {
    const ts = await api.getTeams()
    setTeams(ts)
    const map: Record<string, any[]> = {}
    for (const t of ts) map[t.id] = await api.getTeamMembers(t.id)
    setMembersByTeam(map)
  }

  useEffect(() => { load() }, [])

  async function remove(teamId: number, memberId: number) {
    await api.removeTeamMember(teamId, memberId)
    await load()
  }

  async function delTeam(id: number) {
    await api.deleteTeam(id)
    await load()
  }

  return (
    <div className="col" style={{ gap: 16 }}>
      <h1 className="h1">Team Management</h1>
      <div className="grid">
        {teams.map((t: any) => (
          <div key={t.id} className="card">
            <div className="row" style={{ justifyContent:'space-between' }}>
              <div className="row" style={{ gap: 12 }}>
                {t.logoUrl ? <img src={t.logoUrl} width={40} height={40} style={{ borderRadius: 8, objectFit: 'cover' }} /> : <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(255,255,255,.08)' }} />}
                <div className="col"><b>{t.name}</b><small>{(membersByTeam[t.id]||[]).length} members</small></div>
              </div>
              <Button className="button danger" onClick={() => delTeam(t.id)}>Delete</Button>
            </div>
            <div className="list" style={{ marginTop: 12 }}>
              {(membersByTeam[t.id] || []).map((m: any) => (
                <div key={m.id} className="item">
                  <div className="col"><b>{m.name}</b><small>{m.email}</small></div>
                  <Button className="button secondary" onClick={() => remove(t.id, m.id)}>Remove</Button>
                </div>
              ))}
              {(membersByTeam[t.id] || []).length === 0 && <small>No members</small>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
