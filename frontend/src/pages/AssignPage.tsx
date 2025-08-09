import { useMemo, useState } from 'react'
import { Select } from '../components/Select'
import { Button } from '../components/Button'
import { useActions, useAppState } from '../state/store'
import { Avatar } from '../components/Avatar'
import { useToast } from '../components/Toast'

export default function AssignPage() {
  const { members, teams } = useAppState()
  const { assign } = useActions()
  const { add } = useToast()
  const [memberId, setMemberId] = useState('')
  const [teamId, setTeamId] = useState('')

  const canSubmit = useMemo(() => members.some(m => m.id === memberId) && teams.some(t => t.id === teamId), [memberId, teamId, members, teams])

  function submit() {
    if (!canSubmit) return
    assign(memberId, teamId)
    setMemberId('')
    setTeamId('')
    add('success')
  }

  return (
    <div className="col" style={{ gap: 16 }}>
      <h1 className="h1">Assign To Team</h1>
      <div className="card">
        <div className="row" style={{ gap: 12 }}>
          <Select value={memberId} onChange={e => setMemberId(e.target.value)} label="Member">
            <option value="">Select member</option>
            {members.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </Select>
          <Select value={teamId} onChange={e => setTeamId(e.target.value)} label="Team">
            <option value="">Select team</option>
            {teams.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </Select>
          <div style={{ alignSelf: 'end' }}>
            <Button disabled={!canSubmit} onClick={submit}>Assign</Button>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="h1">Teams</h2>
        <div className="grid">
          {teams.map(t => (
            <div key={t.id} className="card">
              <div className="row" style={{ gap: 12 }}>
                {t.logoUrl ? <img src={t.logoUrl} width={40} height={40} style={{ borderRadius: 8, objectFit: 'cover' }} /> : <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(255,255,255,.08)' }} />}
                <div className="col" style={{ flex: 1 }}>
                  <b>{t.name}</b>
                  <small>{t.memberIds.length} members</small>
                </div>
              </div>
              <div className="list" style={{ marginTop: 12 }}>
                {t.memberIds.map(id => {
                  const m = members.find(mm => mm.id === id)
                  if (!m) return null
                  return (
                    <div key={id} className="item">
                      <div className="row">
                        <Avatar name={m.name} src={m.pictureUrl} />
                        <div className="col">
                          <b>{m.name}</b>
                          <small>{m.email}</small>
                        </div>
                      </div>
                      <span className="kbd">{m.teamIds.length} teams</span>
                    </div>
                  )
                })}
                {t.memberIds.length === 0 && <small>No members yet</small>}
              </div>
            </div>
          ))}
          {teams.length === 0 && <small>No teams yet</small>}
        </div>
      </div>
    </div>
  )
}
