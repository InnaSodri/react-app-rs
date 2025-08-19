import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type Strength = { hasNumber: boolean; hasUpper: boolean; hasLower: boolean; hasSpecial: boolean }
export type FormEntry = {
  id: string
  name: string
  age: number
  email: string
  password: string
  confirm: string
  gender: 'male'|'female'|'other'
  accept: true
  imageBase64?: string
  country: string
  strength: Strength
  source: 'uncontrolled'|'rhf'
}

type State = { entries: FormEntry[] }
const initialState: State = { entries: [] }

const slice = createSlice({
  name: 'forms',
  initialState,
  reducers: {
    upsertEntry: (state, action: PayloadAction<FormEntry>) => {
      state.entries.unshift(action.payload)
    },
  },
})

export const { upsertEntry } = slice.actions
export default slice.reducer

