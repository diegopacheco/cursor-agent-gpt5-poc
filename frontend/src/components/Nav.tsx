import { NavLink } from 'react-router-dom'

export function Nav() {
  return (
    <div className="nav">
      <img src="/logo-app.png" alt="logo" width={28} height={28} style={{ borderRadius: 6 }} />
      <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>Home</NavLink>
      <NavLink to="/add-member" className={({ isActive }) => (isActive ? 'active' : '')}>Add Member</NavLink>
      <NavLink to="/create-team" className={({ isActive }) => (isActive ? 'active' : '')}>Create Team</NavLink>
      <NavLink to="/assign" className={({ isActive }) => (isActive ? 'active' : '')}>Assign</NavLink>
      <NavLink to="/feedback" className={({ isActive }) => (isActive ? 'active' : '')}>Feedback</NavLink>
      <NavLink to="/manage" className={({ isActive }) => (isActive ? 'active' : '')}>Manage</NavLink>
      <NavLink to="/feedbacks" className={({ isActive }) => (isActive ? 'active' : '')}>All Feedback</NavLink>
    </div>
  )
}
