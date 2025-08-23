import { describe, it, expect } from 'vitest'
import { Provider } from 'react-redux'
import { store } from '../store/store'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

describe('App aria labels', () => {
  it('maps aria-label correctly for all modals', async () => {
    const u = userEvent.setup()
    render(
      <Provider store={store}>
        <App />
      </Provider>
    )

    await u.click(screen.getByRole('button', { name: /open react hook form/i }))
    expect(await screen.findByRole('dialog', { name: /rhf form/i })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /close/i }))

    await u.click(screen.getByRole('button', { name: /open formik/i }))
    expect(await screen.findByRole('dialog', { name: /formik form/i })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /close/i }))

    await u.click(screen.getByRole('button', { name: /open useactionstate/i }))
    expect(await screen.findByRole('dialog', { name: /useactionstate demo/i })).toBeInTheDocument()
  })
})
