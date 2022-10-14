import { createSlice } from '@reduxjs/toolkit';

const initialState = { counter: 0, sort: 'new', currentPage: 1 };

const postListSlice = createSlice({
  name: 'postList',
  initialState,
  reducers: {
    increase: (state) => {
      state.counter = state.counter + 1;
    },

    setSortNew: (state) => {
      state.sort = 'new';
    },

    setSortHot: (state) => {
      state.sort = 'hot';
    },

    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
});

export const postListActions = postListSlice.actions;

export default postListSlice.reducer;
