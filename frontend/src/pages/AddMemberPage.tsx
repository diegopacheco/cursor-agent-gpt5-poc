import { useState, useMemo } from 'react'
import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { FormSection } from '../components/FormSection'
import { useActions, useAppState } from '../state/store'
import { Avatar } from '../components/Avatar'
import { useToast } from '../components/Toast'

function isEmailValid(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function AddMemberPage() {
  const { members } = useAppState()
  const { addMember } = useActions()
  const { add } = useToast()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pictureUrl, setPictureUrl] = useState('')

  const canSubmit = useMemo(() => name.trim().length > 1 && isEmailValid(email) && pictureUrl.trim().length >= 0, [name, email, pictureUrl])

  function submit() {
    if (!canSubmit) return
    addMember(name, email, pictureUrl || undefined)
    setName('')
    setEmail('')
    setPictureUrl('')
    add('success')
  }

  return (
    <div className="col" style={{ gap: 16 }}>
      <h1 className="h1">Add Team Member</h1>
      <FormSection title="New Member">
        <div className="row" style={{ gap: 16 }}>
          <Avatar name={name || 'Preview'} src={pictureUrl || undefined} size={56} />
          <div className="col" style={{ flex: 1 }}>
            <Input placeholder="Jane Doe" label="Name" value={name} onChange={e => setName(e.target.value)} />
            <Input placeholder="jane@acme.com" label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
            <Input placeholder="https://..." label="Picture URL" type="url" value={pictureUrl} onChange={e => setPictureUrl(e.target.value)} />
            <div className="row" style={{ justifyContent: 'flex-end' }}>
              <Button disabled={!canSubmit} onClick={submit}>Save</Button>
            </div>
          </div>
        </div>
      </FormSection>

      <div className="section">
        <h2 className="h1">Members</h2>
        <div className="list">
          {members.map(m => (
            <div key={m.id} className="item">
              <div className="row">
                <Avatar name={m.name} src={m.pictureUrl} />
                <div className="col">
                  <b>{m.name}</b>
                  <small>{m.email}</small>
                </div>
              </div>
              <small>{m.teamIds.length} teams</small>
            </div>
          ))}
          {members.length === 0 && <small>No members yet</small>}
        </div>
      </div>
    </div>
  )
}
