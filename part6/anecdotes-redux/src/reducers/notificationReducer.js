import { createSlice } from "@reduxjs/toolkit";

const initialState = ''

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotif(state, action) {
      return action.payload
    }
  }
})

export const { setNotif } = notificationSlice.actions

export const setNotification = (notif, timeout) => {
  // 第一个参数是要呈现的文本，第二个参数是以秒为单位的通知显示时间。
  return async dispatch => {
    dispatch(setNotif(notif))
    setTimeout(() => {
      dispatch(setNotif(''))
    }, timeout * 1000)
  }
}

export default notificationSlice.reducer