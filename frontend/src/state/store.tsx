import { createContext, useContext, useMemo, useReducer, ReactNode } from 'react'
import type { AppState, Member, Team, Feedback } from './types'

type Action =
  | { type: 'addMember'; payload: { name: string; email: string; pictureUrl?: string } }
  | { type: 'addTeam'; payload: { name: string; logoUrl?: string } }
  | { type: 'assign'; payload: { memberId: string; teamId: string } }
  | { type: 'addFeedback'; payload: { targetType: Feedback['targetType']; targetId: string; content: string } }

const initialState: AppState = { members: [], teams: [], feedbacks: [] }

function reducer(state: AppState, action: Action): AppState {
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

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const memoState = useMemo(() => state, [state])
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
    },
    addTeam(name: string, logoUrl?: string) {
      dispatch({ type: 'addTeam', payload: { name: name.trim(), logoUrl: logoUrl?.trim() } })
    },
    assign(memberId: string, teamId: string) {
      dispatch({ type: 'assign', payload: { memberId, teamId } })
    },
    addFeedback(targetType: Feedback['targetType'], targetId: string, content: string) {
      dispatch({ type: 'addFeedback', payload: { targetType, targetId, content } })
    },
  }
}
