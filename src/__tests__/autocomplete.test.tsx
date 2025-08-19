import { it, expect, vi } from 'vitest'
import { Provider } from 'react-redux'
import { store } from '../store/store'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CountryAutocomplete from '../forms/CountryAutocomplete'

it('filters and selects country', async () => {
  const u = userEvent.setup()
  const onChange = vi.fn()
  render(
    <Provider store={store}>
      <CountryAutocomplete id="c" value="" onChange={onChange} />
    </Provider>
  )
  await u.type(screen.getByLabelText('Country'), 'isr')
  const option = await screen.findByRole('button', { name: /^Israel$/i })
  await u.click(option)
  expect(onChange).toHaveBeenCalledWith('Israel')
})
