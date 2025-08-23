import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ActionStateDemo from '../forms/ActionStateDemo'

describe('useActionState demo', () => {
  it('increments count via formAction', async () => {
    const u = userEvent.setup()
    render(<ActionStateDemo />)

    expect(screen.getByText(/Count:\s*0/i)).toBeInTheDocument()

    await u.click(screen.getByRole('button', { name: /increment/i }))
    await screen.findByText(/Count:\s*1/i)

    await u.click(screen.getByRole('button', { name: /increment/i }))
    await screen.findByText(/Count:\s*2/i)
  })
})
