import { describe, it, expect, beforeEach } from 'vitest'
import { Provider } from 'react-redux'
import { store } from '../store/store'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

describe('Compact toggle and modal class', () => {
  beforeEach(() => {
    localStorage.removeItem('compact')
  })

  it('toggles compact and applies compact class to dialog', async () => {
    const u = userEvent.setup({ delay: null })
    render(<Provider store={store}><App /></Provider>)

    const toggle = screen.getByRole('button', { name: /compact:/i })
    expect(toggle).toHaveAttribute('aria-pressed', 'false')
    expect(toggle).toHaveTextContent(/compact:\s*off/i)

    await u.click(toggle)
    expect(toggle).toHaveAttribute('aria-pressed', 'true')
    expect(toggle).toHaveTextContent(/compact:\s*on/i)

    await u.click(screen.getByRole('button', { name: /open uncontrolled/i }))
    const dlg = screen.getByRole('dialog')
    expect(dlg).toBeInTheDocument()
    expect(dlg.classList.contains('compact')).toBe(true)

    await u.click(screen.getByRole('button', { name: /close/i }))
  })
})
