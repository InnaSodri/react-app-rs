import { it, expect } from 'vitest'
import { selectEntries, selectCountries, selectLatestEntry, selectEntryCount } from '../store/selectors'
import type { RootState } from '../store/store'

const base: RootState = {
  forms: { entries: [
    { id:'2', name:'Bob', age:30, email:'b@b.com', password:'A1a!xxxx', confirm:'A1a!xxxx', gender:'male', accept:true, country:'Israel', strength:{hasLower:true,hasUpper:true,hasNumber:true,hasSpecial:true}, source:'rhf' }
  ]},
  countries: { all: ['Israel','United States'] }
}

it('selects entries and countries', () => {
  expect(selectEntries(base).length).toBe(1)
  expect(selectCountries(base)).toContain('Israel')
})

it('latest and count', () => {
  expect(selectLatestEntry(base)?.id).toBe('2')
  expect(selectEntryCount(base)).toBe(1)
})
