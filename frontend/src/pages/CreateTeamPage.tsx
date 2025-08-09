import { useMemo, useState } from 'react'
import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { FormSection } from '../components/FormSection'
import { useActions, useAppState } from '../state/store'

export default function CreateTeamPage() {
  const { teams } = useAppState()
  const { addTeam } = useActions()
  const [name, setName] = useState('')
  const [logoUrl, setLogoUrl] = useState('')

  const canSubmit = useMemo(() => name.trim().length > 1, [name])

  function submit() {
    if (!canSubmit) return
    addTeam(name, logoUrl || undefined)
    setName('')
    setLogoUrl('')
  }

  return (
    <div className="col" style={{ gap: 16 }}>
      <h1 className="h1">Create Team</h1>
      <FormSection title="New Team">
        <Input placeholder="Team Rockets" label="Team Name" value={name} onChange={e => setName(e.target.value)} />
        <Input placeholder="https://..." label="Team Logo URL" type="url" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} />
        <div className="row" style={{ justifyContent: 'flex-end' }}>
          <Button disabled={!canSubmit} onClick={submit}>Save</Button>
        </div>
      </FormSection>

      <div className="section">
        <h2 className="h1">Teams</h2>
        <div className="grid">
          {teams.map(t => (
            <div key={t.id} className="card">
              <div className="row">
                {t.logoUrl ? <img src={t.logoUrl} width={40} height={40} style={{ borderRadius: 8, objectFit: 'cover' }} /> : <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(255,255,255,.08)' }} />}
                <div className="col">
                  <b>{t.name}</b>
                  <small>{t.memberIds.length} members</small>
                </div>
              </div>
            </div>
          ))}
          {teams.length === 0 && <small>No teams yet</small>}
        </div>
      </div>
    </div>
  )
}
