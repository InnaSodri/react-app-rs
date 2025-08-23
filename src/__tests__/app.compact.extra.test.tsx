import { describe, it, expect } from 'vitest'
import { Provider } from 'react-redux'
import { store } from '../store/store'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

describe('App compact toggle branches', () => {
  it('toggles compact and applies class on dialog and form', async () => {
    const u = userEvent.setup()
    render(
      <Provider store={store}>
        <App />
      </Provider>
    )

    await u.click(screen.getByRole('button', { name: /compact: off/i }))
    await u.click(screen.getByRole('button', { name: /open react hook form/i }))

    const dialog = await screen.findByRole('dialog', { name: /rhf form/i })
    expect(dialog).toBeInTheDocument()
    expect(dialog).toHaveClass('compact')

    const form = dialog.querySelector('form') as HTMLFormElement | null
    expect(form).not.toBeNull()
    expect(form!).toHaveClass('compact')
  })
})
