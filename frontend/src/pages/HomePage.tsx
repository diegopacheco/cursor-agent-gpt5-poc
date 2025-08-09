import { Link } from 'react-router-dom'
import { useAppState } from '../state/store'

export default function HomePage() {
  const { members, teams, feedbacks } = useAppState()
  return (
    <div className="col" style={{ gap: 20 }}>
      <h1 className="h1">Coaching App</h1>
      <div className="grid">
        <div className="card">
          <h3>Add Team Member</h3>
          <p><small>Create people to assign into teams</small></p>
          <Link to="/add-member" className="button">Open</Link>
        </div>
        <div className="card">
          <h3>Create Team</h3>
          <p><small>Create teams</small></p>
          <Link to="/create-team" className="button">Open</Link>
        </div>
        <div className="card">
          <h3>Assign to Team</h3>
          <p><small>Assign people into teams</small></p>
          <Link to="/assign" className="button">Open</Link>
        </div>
        <div className="card">
          <h3>Give Feedback</h3>
          <p><small>Send feedback to teams or people</small></p>
          <Link to="/feedback" className="button">Open</Link>
        </div>
      </div>
      <div className="grid">
        <div className="card">
          <h3>Members</h3>
          <p><small>{members.length} total</small></p>
        </div>
        <div className="card">
          <h3>Teams</h3>
          <p><small>{teams.length} total</small></p>
        </div>
        <div className="card">
          <h3>Feedback</h3>
          <p><small>{feedbacks.length} total</small></p>
        </div>
      </div>
    </div>
  )
}
