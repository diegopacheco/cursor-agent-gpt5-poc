import { screen, fireEvent } from '@testing-library/react'
import AddMemberPage from '../AddMemberPage'
import { renderWithProviders } from '../../test/test-utils'

it('adds a member', () => {
  renderWithProviders(<AddMemberPage />)
  const name = screen.getByLabelText('Name') as HTMLInputElement
  const email = screen.getByLabelText('Email') as HTMLInputElement
  fireEvent.change(name, { target: { value: 'John Doe' } })
  fireEvent.change(email, { target: { value: 'john@acme.com' } })
  fireEvent.click(screen.getByText('Save'))
  expect(screen.getByText('Members')).toBeInTheDocument()
})
