import { createSlice } from '@reduxjs/toolkit';

const initialState = { postData: null, id: null, shouldUpdate: false };

const currentPostSlice = createSlice({
  name: 'currentPost',
  initialState,
  reducers: {
    setShouldUpdate: (state, action) => {
      state.shouldUpdate = action.payload;
    },

    setPostData: (state, action) => {
      state.postData = { ...action.payload.postData };
      state.id = action.payload.id;
    },

    resetState: (state) => {
      state.id = null;
      state.postData = null;
      state.shouldUpdate = false;
    },
  },
});

export const currentPostActions = currentPostSlice.actions;

export default currentPostSlice.reducer;
