import { NavLink } from 'react-router-dom'

export function Nav() {
  return (
    <div className="nav">
      <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>Home</NavLink>
      <NavLink to="/add-member" className={({ isActive }) => (isActive ? 'active' : '')}>Add Member</NavLink>
      <NavLink to="/create-team" className={({ isActive }) => (isActive ? 'active' : '')}>Create Team</NavLink>
      <NavLink to="/assign" className={({ isActive }) => (isActive ? 'active' : '')}>Assign</NavLink>
      <NavLink to="/feedback" className={({ isActive }) => (isActive ? 'active' : '')}>Feedback</NavLink>
    </div>
  )
}
