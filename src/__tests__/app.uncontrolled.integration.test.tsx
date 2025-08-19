import { describe, it, expect } from 'vitest'
import { Provider } from 'react-redux'
import { store } from '../store/store'
import { render, screen, within, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

function makePng(size = 1000) {
  return new File([new Uint8Array(size)], 'pic.png', { type: 'image/png' })
}

describe('Uncontrolled flow', () => {
  it(
    'submits Uncontrolled form with image, closes modal, shows tile',
    async () => {
      const u = userEvent.setup({ delay: null })

      render(<Provider store={store}><App /></Provider>)

      await u.click(screen.getByRole('button', { name: /uncontrolled/i }))
      const dialog = screen.getByRole('dialog')
      const q = within(dialog)

      await u.type(q.getByLabelText('Name'), 'Bob')
      await u.type(q.getByLabelText('Age'), '30')
      await u.type(q.getByLabelText('Email'), 'b@b.com')
      await u.type(q.getByLabelText('Password'), 'A1a!xxxx')
      await u.type(q.getByLabelText('Confirm Password'), 'A1a!xxxx')

      await u.click(q.getByLabelText('Male', { selector: 'input[type="radio"]' }))
      await u.click(q.getByLabelText(/Accept T&C/i, { selector: 'input[type="checkbox"]' }))

      const fileInput = q.getByLabelText('Picture') as HTMLInputElement
      await u.upload(fileInput, makePng())

      await u.type(q.getByLabelText('Country'), 'Israel')
      await u.click(await q.findByRole('button', { name: /^Israel$/ }))

      await u.click(q.getByRole('button', { name: /submit/i }))
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

      const getFirstTile = () => document.querySelector('.tile') as HTMLElement | null
      const first = getFirstTile()
      expect(first).toBeTruthy()
      expect(first!.textContent?.toLowerCase()).toContain('bob')
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
