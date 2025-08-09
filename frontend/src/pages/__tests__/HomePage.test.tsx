import { screen } from '@testing-library/react'
import HomePage from '../HomePage'
import { renderWithProviders } from '../../test/test-utils'

it('shows quick links and counts', () => {
  renderWithProviders(<HomePage />, { members: [{ id: '1', name: 'Jane', email: 'j@a.com', teamIds: [] }], teams: [{ id: 't1', name: 'Team', memberIds: [] }], feedbacks: [{ id: 'f1', targetType: 'member', targetId: '1', content: 'Nice', createdAt: Date.now() }] })
  expect(screen.getByText('Add Team Member')).toBeInTheDocument()
  expect(screen.getByText('Create Team')).toBeInTheDocument()
  expect(screen.getByText('Assign to Team')).toBeInTheDocument()
  expect(screen.getByText('Give Feedback')).toBeInTheDocument()
  expect(screen.getAllByText('1 total').length).toBeGreaterThan(0)
})
