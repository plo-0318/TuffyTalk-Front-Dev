import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  posts: [],
};

const userProfileDataSlice = createSlice({
  name: 'userProfileData',
  initialState: initialState,
  reducers: {
    setPosts(state, action) {
      state.posts = [...action.payload];
    },

    removePost(state, action) {
      state.posts = state.posts.filter(
        (post) => post._id !== action.payload._id
      );
    },

    addPost(state, action) {
      if (!state.posts.some((post) => post._id === action.payload._id)) {
        state.posts.push(action.payload);
      }
    },
  },
});

export const userProfileDataActions = userProfileDataSlice.actions;

export default userProfileDataSlice.reducer;
