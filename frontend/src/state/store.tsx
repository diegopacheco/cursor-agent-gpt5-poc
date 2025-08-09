import { createContext, useContext, useMemo, useReducer, ReactNode } from 'react'
import type { AppState, Member, Team, Feedback, ApiMember, ApiTeam, ApiFeedback } from './types'
import { api } from '../utils/api'
import { useEffect } from 'react'

type Action =
  | { type: 'addMember'; payload: { name: string; email: string; pictureUrl?: string } }
  | { type: 'addMemberWithId'; payload: { id: string; name: string; email: string; pictureUrl?: string } }
  | { type: 'addTeam'; payload: { name: string; logoUrl?: string } }
  | { type: 'addTeamWithId'; payload: { id: string; name: string; logoUrl?: string } }
  | { type: 'assign'; payload: { memberId: string; teamId: string } }
  | { type: 'addFeedback'; payload: { targetType: Feedback['targetType']; targetId: string; content: string } }
  | { type: 'hydrate'; payload: { members: Member[]; teams: Team[]; feedbacks: Feedback[] } }

export const initialState: AppState = { members: [], teams: [], feedbacks: [] }

function reducer(state: AppState, action: Action): AppState {
  if (action.type === 'hydrate') {
    return { ...state, members: action.payload.members, teams: action.payload.teams, feedbacks: action.payload.feedbacks }
  }
  if (action.type === 'addMember') {
    const id = crypto.randomUUID()
    const member: Member = { id, name: action.payload.name, email: action.payload.email, pictureUrl: action.payload.pictureUrl, teamIds: [] }
    return { ...state, members: [member, ...state.members] }
  }
  if (action.type === 'addMemberWithId') {
    const member: Member = { id: action.payload.id, name: action.payload.name, email: action.payload.email, pictureUrl: action.payload.pictureUrl, teamIds: [] }
    return { ...state, members: [member, ...state.members] }
  }
  if (action.type === 'addTeam') {
    const id = crypto.randomUUID()
    const team: Team = { id, name: action.payload.name, logoUrl: action.payload.logoUrl, memberIds: [] }
    return { ...state, teams: [team, ...state.teams] }
  }
  if (action.type === 'addTeamWithId') {
    const team: Team = { id: action.payload.id, name: action.payload.name, logoUrl: action.payload.logoUrl, memberIds: [] }
    return { ...state, teams: [team, ...state.teams] }
  }
  if (action.type === 'assign') {
    const { memberId, teamId } = action.payload
    const members = state.members.map(m => m.id === memberId ? { ...m, teamIds: Array.from(new Set([...m.teamIds, teamId])) } : m)
    const teams = state.teams.map(t => t.id === teamId ? { ...t, memberIds: Array.from(new Set([...t.memberIds, memberId])) } : t)
    return { ...state, members, teams }
  }
  if (action.type === 'addFeedback') {
    const id = crypto.randomUUID()
    const fb: Feedback = { id, targetType: action.payload.targetType, targetId: action.payload.targetId, content: action.payload.content.trim(), createdAt: Date.now() }
    return { ...state, feedbacks: [fb, ...state.feedbacks] }
  }
  return state
}

const StateContext = createContext<AppState | undefined>(undefined)
const DispatchContext = createContext<React.Dispatch<Action> | undefined>(undefined)

export function StoreProvider({ children, initial }: { children: ReactNode; initial?: AppState }) {
  const [state, dispatch] = useReducer(reducer, initial ?? initialState)
  const memoState = useMemo(() => state, [state])
  useEffect(() => {
    if (initial) return
    ;(async () => {
      const [ms, ts, fbs] = await Promise.all([api.getMembers(), api.getTeams(), api.getFeedback()])
      const members: Member[] = (ms as ApiMember[]).map(m => ({ id: String(m.id), name: m.name, email: m.email, pictureUrl: m.pictureUrl, teamIds: [] }))
      const teams: Team[] = (ts as ApiTeam[]).map(t => ({ id: String(t.id), name: t.name, logoUrl: t.logoUrl, memberIds: [] }))
      const feedbacks: Feedback[] = (fbs as ApiFeedback[]).map(f => ({ id: String(f.id), targetType: f.targetType, targetId: String(f.targetId), content: f.content, createdAt: typeof f.createdAt === 'string' ? new Date(f.createdAt).getTime() : f.createdAt }))
      dispatch({ type: 'hydrate', payload: { members, teams, feedbacks } } as any)
    })()
  }, [])
  return (
    <StateContext.Provider value={memoState}>
      <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
    </StateContext.Provider>
  )
}

export function useAppState() {
  const ctx = useContext(StateContext)
  if (!ctx) throw new Error('State not available')
  return ctx
}

export function useAppDispatch() {
  const ctx = useContext(DispatchContext)
  if (!ctx) throw new Error('Dispatch not available')
  return ctx
}

export function useActions() {
  const dispatch = useAppDispatch()
  return {
    async addMember(name: string, email: string, pictureUrl?: string) {
      const res = await api.createMember({ name, email, pictureUrl })
      const id = String(res.id)
      dispatch({ type: 'addMemberWithId', payload: { id, name: name.trim(), email: email.trim(), pictureUrl: pictureUrl?.trim() } })
    },
    async addTeam(name: string, logoUrl?: string) {
      const res = await api.createTeam({ name, logoUrl })
      const id = String(res.id)
      dispatch({ type: 'addTeamWithId', payload: { id, name: name.trim(), logoUrl: logoUrl?.trim() } })
    },
    async assign(memberId: string, teamId: string) {
      await api.assign({ memberId, teamId })
      dispatch({ type: 'assign', payload: { memberId, teamId } })
    },
    async addFeedback(targetType: Feedback['targetType'], targetId: string, content: string) {
      await api.createFeedback({ targetType, targetId, content })
      dispatch({ type: 'addFeedback', payload: { targetType, targetId, content } })
    },
  }
}
