import { createContext, useContext, useMemo, useReducer, ReactNode } from 'react'
import type { AppState, Member, Team, Feedback, ApiMember, ApiTeam, ApiFeedback } from './types'
import { api } from '../utils/api'
import { useEffect } from 'react'

type Action =
  | { type: 'addMember'; payload: { name: string; email: string; pictureUrl?: string } }
  | { type: 'addTeam'; payload: { name: string; logoUrl?: string } }
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
  if (action.type === 'addTeam') {
    const id = crypto.randomUUID()
    const team: Team = { id, name: action.payload.name, logoUrl: action.payload.logoUrl, memberIds: [] }
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
    addMember(name: string, email: string, pictureUrl?: string) {
      dispatch({ type: 'addMember', payload: { name: name.trim(), email: email.trim(), pictureUrl: pictureUrl?.trim() } })
      api.createMember({ name, email, pictureUrl })
    },
    addTeam(name: string, logoUrl?: string) {
      dispatch({ type: 'addTeam', payload: { name: name.trim(), logoUrl: logoUrl?.trim() } })
      api.createTeam({ name, logoUrl })
    },
    assign(memberId: string, teamId: string) {
      dispatch({ type: 'assign', payload: { memberId, teamId } })
      api.assign({ memberId, teamId })
    },
    addFeedback(targetType: Feedback['targetType'], targetId: string, content: string) {
      dispatch({ type: 'addFeedback', payload: { targetType, targetId, content } })
      api.createFeedback({ targetType, targetId, content })
    },
  }
}
