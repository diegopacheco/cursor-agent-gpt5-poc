import { useEffect, useMemo, useState } from 'react'
import { Select } from '../components/Select'
import { api } from '../utils/api'

export default function AllFeedbackPage() {
  const [targetType, setTargetType] = useState<'member' | 'team' | ''>('')
  const [targetId, setTargetId] = useState('')
  const [items, setItems] = useState<any[]>([])
  const [members, setMembers] = useState<any[]>([])
  const [teams, setTeams] = useState<any[]>([])

  useEffect(() => { (async () => { setMembers(await api.getMembers()); setTeams(await api.getTeams()) })() }, [])
  useEffect(() => { (async () => { setItems(await api.getFeedback(targetType ? { targetType, targetId: targetId || undefined } : undefined) || []) })() }, [targetType, targetId])

  const targets = useMemo(() => targetType === 'member' ? members : targetType === 'team' ? teams : [], [targetType, members, teams])

  return (
    <div className="col" style={{ gap: 16 }}>
      <h1 className="h1">All Feedback</h1>
      <div className="card">
        <div className="row" style={{ gap: 12 }}>
          <Select label="Target" value={targetType} onChange={e => { setTargetType(e.target.value as any); setTargetId('') }}>
            <option value="">All</option>
            <option value="member">Member</option>
            <option value="team">Team</option>
          </Select>
          <Select label="Entity" value={targetId} onChange={e => setTargetId(e.target.value)} disabled={!targetType}>
            <option value="">All</option>
            {targets.map((x: any) => (
              <option key={x.id} value={x.id}>{x.name}</option>
            ))}
          </Select>
        </div>
      </div>
      <div className="list">
        {items.map(f => (
          <div key={f.id} className="item">
            <div className="col">
              <b>{f.targetType} #{f.targetId}</b>
              <small>{new Date(f.createdAt).toLocaleString()}</small>
            </div>
            <div style={{ maxWidth: 600 }}>{f.content}</div>
          </div>
        ))}
        {items.length === 0 && <small>No feedback</small>}
      </div>
    </div>
  )
}
