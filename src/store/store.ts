import { configureStore } from '@reduxjs/toolkit'
import forms from './formsSlice'
import countries from './countriesSlice'
export const store = configureStore({ reducer: { forms, countries } })
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
