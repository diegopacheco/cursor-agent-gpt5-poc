import { screen, fireEvent, waitFor } from '@testing-library/react'
import FeedbackPage from '../FeedbackPage'
import { renderWithProviders } from '../../test/test-utils'

it('sends feedback to a member', async () => {
  renderWithProviders(<FeedbackPage />, { members: [{ id: 'm1', name: 'Jane', email: 'j@a.com', teamIds: [] }] })
  fireEvent.change(screen.getByLabelText('Target'), { target: { value: 'member' } })
  fireEvent.change(screen.getByLabelText('Member'), { target: { value: 'm1' } })
  fireEvent.change(screen.getByLabelText('Feedback'), { target: { value: 'Great job' } })
  fireEvent.click(screen.getByText('Send'))
  await waitFor(() => {
    expect(screen.getByText('Great job')).toBeInTheDocument()
  })
})
