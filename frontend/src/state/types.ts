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
