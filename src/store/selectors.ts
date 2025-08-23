import type { RootState } from './store'
import { createSelector } from '@reduxjs/toolkit'

export const selectEntries = (s: RootState) => s.forms.entries
export const selectCountries = (s: RootState) => s.countries.all

export const selectLatestEntry = createSelector(selectEntries, e => e[0] ?? null)
export const selectEntryCount = createSelector(selectEntries, e => e.length)

