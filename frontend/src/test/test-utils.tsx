import { ReactNode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { render } from '@testing-library/react'
import { StoreProvider, initialState } from '../state/store'
import type { AppState } from '../state/types'

export function renderWithProviders(ui: React.ReactElement, init?: Partial<AppState>) {
  const state: AppState = { ...initialState, ...init, members: init?.members ?? initialState.members, teams: init?.teams ?? initialState.teams, feedbacks: init?.feedbacks ?? initialState.feedbacks }
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <StoreProvider initial={state}>
        <BrowserRouter>{children}</BrowserRouter>
      </StoreProvider>
    )
  }
  return render(ui, { wrapper: Wrapper })
}
