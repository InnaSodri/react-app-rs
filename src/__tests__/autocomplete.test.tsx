import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import CountryAutocomplete from '../forms/CountryAutocomplete'

function renderWithStore(ui: React.ReactElement, countries: string[]) {
  const store = configureStore({
    reducer: {
      countries: (state = { all: countries }) => state
    }
  })
  return render(<Provider store={store}>{ui}</Provider>)
}

describe('CountryAutocomplete', () => {
  const countries = ['Israel', 'Italy', 'Iceland', 'France', 'Spain']

  it('renders closed, opens on partial match, selects by click, then closes', async () => {
    const onChange = vi.fn()
    renderWithStore(
      <CountryAutocomplete id="country-x" value="" onChange={onChange} />,
      countries
    )

    const input = screen.getByLabelText('Country')
    expect(input).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('listbox')).toBeNull()

    await userEvent.type(input, 'Isr')

    const listbox = await screen.findByRole('listbox')
    const israelBtn = within(listbox).getByRole('button', { name: 'Israel' })

    await userEvent.click(israelBtn)

    expect(onChange).toHaveBeenCalledWith('Israel')
    expect((input as HTMLInputElement).value).toBe('Israel')
    expect(input).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  it('hides list on exact match', async () => {
    const onChange = vi.fn()
    renderWithStore(
      <CountryAutocomplete id="country-y" value="" onChange={onChange} />,
      countries
    )
    const input = screen.getByLabelText('Country')

    await userEvent.clear(input)
    await userEvent.type(input, 'Israel')

    expect(input).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('button', { name: 'Israel' })).toBeNull()
  })

  it('selects first option with Enter', async () => {
    const onChange = vi.fn()
    renderWithStore(
      <CountryAutocomplete id="country-z" value="" onChange={onChange} />,
      countries
    )
    const input = screen.getByLabelText('Country')

    await userEvent.type(input, 'Ita{enter}')

    expect(onChange).toHaveBeenCalledWith('Italy')
    expect((input as HTMLInputElement).value).toBe('Italy')
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  it('closes suggestions with Escape', async () => {
    const onChange = vi.fn()
    renderWithStore(
      <CountryAutocomplete id="country-w" value="" onChange={onChange} />,
      countries
    )
    const input = screen.getByLabelText('Country')

    await userEvent.type(input, 'Ic')
    expect(await screen.findByRole('listbox')).toBeInTheDocument()

    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('listbox')).toBeNull()
    expect(input).toHaveAttribute('aria-expanded', 'false')
  })
})
