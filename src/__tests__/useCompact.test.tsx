import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import useCompact from '../hooks/useCompact'

function Probe() {
  const { compact, toggle } = useCompact()
  return (
    <div>
      <span data-testid="flag">{compact ? '1' : '0'}</span>
      <button onClick={toggle}>t</button>
    </div>
  )
}

describe('useCompact', () => {
  beforeEach(() => {
    localStorage.removeItem('compact')
    vi.restoreAllMocks()
  })

  it('initializes from localStorage and toggles', async () => {
    localStorage.setItem('compact', '1')
    const u = userEvent.setup({ delay: null })
    render(<Probe />)
    expect(screen.getByTestId('flag').textContent).toBe('1')
    await u.click(screen.getByText('t'))
    expect(screen.getByTestId('flag').textContent).toBe('0')
  })

  it('handles setItem errors (catch branch)', async () => {
    const u = userEvent.setup({ delay: null })
    const real = window.localStorage
    const fake: Storage = {
      getItem: vi.fn().mockReturnValue('0'),
      setItem: vi.fn(() => { throw new Error('denied') }),
      removeItem: vi.fn(),
      clear: vi.fn(),
      key: vi.fn(),
      length: 0
    }
    Object.defineProperty(window, 'localStorage', { configurable: true, value: fake })
    try {
      render(<Probe />)
      await u.click(screen.getByText('t'))
      expect(screen.getByTestId('flag').textContent).toBe('1')
    } finally {
      Object.defineProperty(window, 'localStorage', { configurable: true, value: real })
    }
  })
})
