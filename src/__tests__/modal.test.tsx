import { it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Modal from '../components/Modal'

it('opens and closes via Escape', async () => {
  const onClose = vi.fn()
  render(<Modal open onClose={onClose} ariaLabel="x"><div>content</div></Modal>)
  expect(screen.getByRole('dialog', { name: 'x' })).toBeInTheDocument()
  await userEvent.keyboard('{Escape}')
  expect(onClose).toHaveBeenCalled()
})
