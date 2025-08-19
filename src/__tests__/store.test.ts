import { it, expect } from 'vitest'
import { store } from '../store/store'
import { upsertEntry } from '../store/formsSlice'

it('stores submission', () => {
  store.dispatch(upsertEntry({
    id: '1',
    name: 'Alice',
    age: 20,
    email: 'a@a.com',
    password: 'A1a!xxxx',
    confirm: 'A1a!xxxx',
    gender: 'female',
    accept: true,
    country: 'Israel',
    strength: { hasLower:true, hasUpper:true, hasNumber:true, hasSpecial:true },
    source: 'rhf'
  }))
  expect(store.getState().forms.entries[0].name).toBe('Alice')
})
