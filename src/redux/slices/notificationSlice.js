import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  unreadCount: 0,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload ?? 0;
    },
    incrementUnreadCount: (state, action) => {
      state.unreadCount += action.payload ?? 1;
    },
    decrementUnreadCount: (state, action) => {
      state.unreadCount = Math.max(0, state.unreadCount - (action.payload ?? 0));
    },
  },
});

export const {
  setUnreadCount,
  incrementUnreadCount,
  decrementUnreadCount,
} = notificationSlice.actions;

export default notificationSlice.reducer;
