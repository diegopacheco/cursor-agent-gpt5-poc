import { screen, fireEvent } from '@testing-library/react'
import AssignPage from '../AssignPage'
import { renderWithProviders } from '../../test/test-utils'

it('assigns member to team', () => {
  renderWithProviders(<AssignPage />, { members: [{ id: 'm1', name: 'Jane', email: 'j@a.com', teamIds: [] }], teams: [{ id: 't1', name: 'Alpha', memberIds: [] }] })
  fireEvent.change(screen.getByLabelText('Member'), { target: { value: 'm1' } })
  fireEvent.change(screen.getByLabelText('Team'), { target: { value: 't1' } })
  fireEvent.click(screen.getByText('Assign'))
  expect(screen.getByText('1 members')).toBeInTheDocument()
})
