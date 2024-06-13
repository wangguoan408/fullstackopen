import { createSlice } from '@reduxjs/toolkit'

// ? 为什么不能直接在 createSlice 中使用空字符串
const initialState = ''

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setFilter(state, action) {
      return action.payload
    }
  }
})

export const { setFilter } = filterSlice.actions
export default filterSlice.reducer