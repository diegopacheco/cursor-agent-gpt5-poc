import { useMemo, useState } from 'react'
import { Select } from '../components/Select'
import { Button } from '../components/Button'
import { TextArea } from '../components/TextArea'
import { useActions, useAppState } from '../state/store'

export default function FeedbackPage() {
  const { members, teams, feedbacks } = useAppState()
  const { addFeedback } = useActions()
  const [targetType, setTargetType] = useState<'member' | 'team'>('member')
  const [targetId, setTargetId] = useState('')
  const [content, setContent] = useState('')

  const canSubmit = useMemo(() => targetId.length > 0 && content.trim().length > 2, [targetId, content])

  function submit() {
    if (!canSubmit) return
    addFeedback(targetType, targetId, content)
    setContent('')
  }

  const targetName = (id: string) => {
    if (targetType === 'member') return members.find(m => m.id === id)?.name || 'Unknown'
    return teams.find(t => t.id === id)?.name || 'Unknown'
  }

  return (
    <div className="col" style={{ gap: 16 }}>
      <h1 className="h1">Give Feedback</h1>
      <div className="card">
        <div className="row" style={{ gap: 12 }}>
          <Select label="Target" value={targetType} onChange={e => { setTargetType(e.target.value as 'member' | 'team'); setTargetId('') }}>
            <option value="member">Member</option>
            <option value="team">Team</option>
          </Select>
          <Select label={targetType === 'member' ? 'Member' : 'Team'} value={targetId} onChange={e => setTargetId(e.target.value)}>
            <option value="">Select</option>
            {(targetType === 'member' ? members : teams).map(x => (
              <option key={x.id} value={x.id}>{x.name}</option>
            ))}
          </Select>
        </div>
        <div className="section">
          <TextArea label="Feedback" placeholder="Write your feedback" value={content} onChange={e => setContent(e.target.value)} />
          <div className="row" style={{ justifyContent: 'flex-end' }}>
            <Button disabled={!canSubmit} onClick={submit}>Send</Button>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="h1">Recent Feedback</h2>
        <div className="list">
          {feedbacks.map(f => (
            <div key={f.id} className="item">
              <div className="col">
                <b>{targetName(f.targetId)} {f.targetType === 'team' ? '(Team)' : ''}</b>
                <small>{new Date(f.createdAt).toLocaleString()}</small>
              </div>
              <div style={{ maxWidth: 600 }}>{f.content}</div>
            </div>
          ))}
          {feedbacks.length === 0 && <small>No feedback yet</small>}
        </div>
      </div>
    </div>
  )
}
