import { createSlice } from '@reduxjs/toolkit'

const list = [
  'Israel','United States','Canada','United Kingdom','France','Germany','Italy','Spain',
  'Ukraine','Poland','Romania','Netherlands','Belgium','Sweden','Norway','Denmark',
  'Finland','Switzerland','Austria','Greece','Portugal','Czech Republic','Hungary',
  'Ireland','Australia','New Zealand','Brazil','Argentina','Mexico','Japan','China',
  'India','South Korea','Singapore','Turkey','South Africa','Egypt','Morocco','UAE'
]

const slice = createSlice({
  name: 'countries',
  initialState: { all: list },
  reducers: {}
})

export default slice.reducer
