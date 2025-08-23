import { describe, it, expect, vi } from 'vitest'
import { Provider } from 'react-redux'
import { store } from '../store/store'
import { render, screen, within, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
import FormikForm from '../forms/FormikForm'
import { fireEvent } from '@testing-library/react'

describe('App – Formik branches', () => {
  it('toggles genderOther, selects country, uploads file', async () => {
    const u = userEvent.setup()
    render(<Provider store={store}><App /></Provider>)

    await u.click(screen.getByRole('button', { name: /open formik/i }))

    expect(await screen.findByLabelText(/please specify/i)).toBeInTheDocument()
    await u.click(screen.getByRole('radio', { name: /^male$/i }))
    expect(screen.queryByLabelText(/please specify/i)).not.toBeInTheDocument()

    await u.type(screen.getByLabelText('Country'), 'Isr')
    const listbox = await screen.findByRole('listbox')
    await u.click(within(listbox).getByRole('button', { name: 'Israel' }))

    const file = new File(['x'], 'a.png', { type: 'image/png' })
    await u.upload(screen.getByLabelText(/picture/i), file)
    expect((screen.getByLabelText(/picture/i) as HTMLInputElement).files?.[0]?.name).toBe('a.png')
  })

  it('strength toggles, form validates, submit enables, onDone is called', async () => {
    const u = userEvent.setup()
    const onDone = vi.fn()
    render(<Provider store={store}><FormikForm onDone={onDone} /></Provider>)

    const pwd = screen.getByLabelText(/^password$/i)
    const confirm = screen.getByLabelText(/^confirm password$/i)
    const submit = screen.getByRole('button', { name: /submit/i })

    const min8 = screen.getByText(/min 8 chars/i)
    expect(min8).toHaveAttribute('data-ok', 'false')

    await u.type(pwd, 'A1a!xxxx')
    expect(min8).toHaveAttribute('data-ok', 'true')
    await u.type(confirm, 'A1a!xxxx')

    await u.type(screen.getByLabelText(/^name$/i), 'Alice')
    const age = screen.getByLabelText(/^age$/i)
    await u.clear(age)
    await u.type(age, '22')
    await u.type(screen.getByLabelText(/^email$/i), 'a@a.com')
    await u.click(screen.getByRole('radio', { name: /^male$/i }))
    await u.click(screen.getByLabelText(/accept t&c/i))

    await u.type(screen.getByLabelText('Country'), 'Isr')
    const listbox = await screen.findByRole('listbox')
    await u.click(within(listbox).getByRole('button', { name: 'Israel' }))

    await waitFor(() => expect(submit).not.toBeDisabled())
    await u.click(submit)
    expect(onDone).toHaveBeenCalledTimes(1)
  })

  
  it('shows required errors on blur, then clears after fixing', async () => {
    const u = userEvent.setup()
    render(<Provider store={store}><App /></Provider>)
    await u.click(screen.getByRole('button', { name: /open formik/i }))
  
    const name = screen.getByLabelText(/^name$/i)
    const country = screen.getByLabelText('Country')
    const cb = screen.getByLabelText(/accept t&c/i)
    const specify = screen.getByLabelText(/please specify/i)
  
    name.focus(); fireEvent.blur(name)
    country.focus(); fireEvent.blur(country)
    cb.focus(); fireEvent.blur(cb)
    specify.focus(); fireEvent.blur(specify)
  
    const errHas = (re: RegExp) =>
      screen.queryAllByText(re).some(el => el.classList.contains('err'))
    const errCount = (re: RegExp) =>
      screen.queryAllByText(re).filter(el => el.classList.contains('err')).length
  
    expect(await screen.findByText(/name is required/i)).toBeInTheDocument()
    expect(errHas(/you must accept/i)).toBe(true)
  
    await u.type(name, 'Ada')
    await u.click(cb)
    await u.click(screen.getByRole('radio', { name: /^male$/i }))
  
    await u.type(country, 'Isr')
    const listbox = await screen.findByRole('listbox')
    await u.click(within(listbox).getByRole('button', { name: 'Israel' }))
  
    expect(errCount(/name is required/i)).toBe(0)
    expect(errCount(/you must accept/i)).toBe(0)
    expect(errCount(/please specify/i)).toBe(0)
  })

  
})
