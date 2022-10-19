import { createSlice } from '@reduxjs/toolkit';
import { getUserImg } from '../utils/util';

const inititalAuthState = {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: inititalAuthState,
  reducers: {
    login(state) {
      state.isAuthenticated = true;
    },
    logout(state) {
      state.isAuthenticated = false;
    },
    setUser(state, action) {
      if (action.payload) {
        const userImg = getUserImg(action.payload);
        action.payload.profilePicture = userImg;
      }

      state.user = action.payload;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
