import { Nav } from './components/Nav'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AddMemberPage from './pages/AddMemberPage'
import CreateTeamPage from './pages/CreateTeamPage'
import AssignPage from './pages/AssignPage'
import FeedbackPage from './pages/FeedbackPage'
import AllFeedbackPage from './pages/AllFeedbackPage'
import ManageTeamPage from './pages/ManageTeamPage'

export default function App() {
  return (
    <div>
      <Nav />
      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add-member" element={<AddMemberPage />} />
          <Route path="/create-team" element={<CreateTeamPage />} />
          <Route path="/assign" element={<AssignPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/feedbacks" element={<AllFeedbackPage />} />
          <Route path="/manage" element={<ManageTeamPage />} />
        </Routes>
      </div>
    </div>
  )
}
