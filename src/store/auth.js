import { createSlice } from '@reduxjs/toolkit';
import { getUserImg } from '../utils/util';

const inititalAuthState = {
  isAuthenticated: false,
  user: null,
  bookmarks: null,
  likedPosts: null,
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
      const user = action.payload ? { ...action.payload } : null;

      if (action.payload) {
        const userImg = getUserImg(action.payload);
        user.profilePicture = userImg;
      }

      state.user = user;
    },
    setBookmarks(state, action) {
      state.bookmarks = Array.isArray(action.payload)
        ? [...action.payload]
        : null;
    },
    setLikedPosts(state, action) {
      state.likedPosts = Array.isArray(action.payload)
        ? [...action.payload]
        : null;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
