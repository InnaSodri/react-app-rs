import { describe, it, expect } from 'vitest'
import { Provider } from 'react-redux'
import { store } from '../store/store'
import { render, screen, within, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

describe('Formik flow', () => {
  it(
    'submits Formik form, closes modal, shows new tile with highlight then clears',
    async () => {
      const u = userEvent.setup({ delay: null })
      render(<Provider store={store}><App /></Provider>)

      await u.click(screen.getByRole('button', { name: /open formik/i }))

      await u.type(screen.getByLabelText('Name'), 'Alice')
      await u.type(screen.getByLabelText('Age'), '22')
      await u.type(screen.getByLabelText('Email'), 'a@a.com')
      await u.type(screen.getByLabelText('Password'), 'A1a!xxxx')
      await u.type(screen.getByLabelText('Confirm Password'), 'A1a!xxxx')
      await u.click(screen.getByLabelText('Female', { selector: 'input[type="radio"]' }))
      await u.click(screen.getByLabelText(/Accept T&C/i, { selector: 'input[type="checkbox"]' }))

      await u.type(screen.getByLabelText('Country'), 'Isr')
      const listbox = await screen.findByRole('listbox')
      await u.click(within(listbox).getByRole('button', { name: 'Israel' }))

      await u.click(screen.getByRole('button', { name: /submit/i }))
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())

      const tile = document.querySelector('.tile') as HTMLElement | null
      expect(tile).toBeTruthy()
      expect(tile!.classList.contains('tile-new')).toBe(true)
      await waitFor(() => expect(tile!.classList.contains('tile-new')).toBe(false), { timeout: 5000 })
    },
    15000
  )
})
