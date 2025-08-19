import { it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Modal from '../components/Modal'

it('closes on outside click', async () => {
  const onClose = vi.fn()
  render(<Modal open onClose={onClose} ariaLabel="x"><div>content</div></Modal>)
  const overlay = document.querySelector('.overlay') as HTMLElement
  fireEvent.mouseDown(overlay)
  expect(onClose).toHaveBeenCalled()
})

it('returns focus to the opener on close', async () => {
  const onClose = vi.fn()
  render(
    <>
      <button data-testid="opener">Open</button>
      <Modal open onClose={onClose} ariaLabel="x"><button>inside</button></Modal>
    </>
  )
  const opener = screen.getByTestId('opener') as HTMLButtonElement
  opener.focus()
  await userEvent.keyboard('{Escape}')
  expect(onClose).toHaveBeenCalled()
  expect(document.activeElement).toBe(opener)
})
