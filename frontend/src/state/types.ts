export type Member = {
  id: string
  name: string
  email: string
  pictureUrl?: string
  teamIds: string[]
}

export type Team = {
  id: string
  name: string
  logoUrl?: string
  memberIds: string[]
}

export type Feedback = {
  id: string
  targetType: 'member' | 'team'
  targetId: string
  content: string
  createdAt: number
}

export type AppState = {
  members: Member[]
  teams: Team[]
  feedbacks: Feedback[]
}

export type ApiMember = { id: number; name: string; email: string; pictureUrl?: string }
export type ApiTeam = { id: number; name: string; logoUrl?: string }
export type ApiFeedback = { id: number; targetType: 'member' | 'team'; targetId: number; content: string; createdAt: string | number }
