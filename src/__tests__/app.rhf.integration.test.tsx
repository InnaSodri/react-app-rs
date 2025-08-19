import { describe, it, expect } from 'vitest'
import { Provider } from 'react-redux'
import { store } from '../store/store'
import { render, screen, within, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

describe('RHF flow', () => {
  it(
    'submits RHF form, closes modal, shows new tile with highlight then clears',
    async () => {
      const u = userEvent.setup({ delay: null })

      render(<Provider store={store}><App /></Provider>)

      await u.click(screen.getByRole('button', { name: /react hook form|rhf/i }))
      const dialog = screen.getByRole('dialog')
      const q = within(dialog)

      await u.type(q.getByLabelText('Name'), 'Alice')
      await u.type(q.getByLabelText('Age'), '22')
      await u.type(q.getByLabelText('Email'), 'a@a.com')
      await u.type(q.getByLabelText('Password'), 'A1a!xxxx')
      await u.type(q.getByLabelText('Confirm Password'), 'A1a!xxxx')
      await u.click(q.getByLabelText('Female', { selector: 'input[type="radio"]' }))
      await u.click(q.getByLabelText(/Accept T&C/i, { selector: 'input[type="checkbox"]' }))
      await u.type(q.getByLabelText('Country'), 'Israel')
      await u.click(await q.findByRole('button', { name: /^Israel$/ }))

      await u.click(q.getByRole('button', { name: /submit/i }))
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

      const getFirstTile = () => document.querySelector('.tile') as HTMLElement | null
      const first = getFirstTile()
      expect(first).toBeTruthy()
      expect(first!.classList.contains('tile-new')).toBe(true)

      await waitFor(
        () => {
          const t = getFirstTile()
          expect(t).toBeTruthy()
          expect(t!.classList.contains('tile-new')).toBe(false)
        },
        { timeout: 5000 }
      )
    },
    15000
  )
})
