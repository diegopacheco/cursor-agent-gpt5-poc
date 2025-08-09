import { screen, fireEvent } from '@testing-library/react'
import CreateTeamPage from '../CreateTeamPage'
import { renderWithProviders } from '../../test/test-utils'

it('creates a team', () => {
  renderWithProviders(<CreateTeamPage />)
  const name = screen.getByLabelText('Team Name') as HTMLInputElement
  fireEvent.change(name, { target: { value: 'Alpha' } })
  fireEvent.click(screen.getByText('Save'))
  expect(screen.getByText('Teams')).toBeInTheDocument()
})
