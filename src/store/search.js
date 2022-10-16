import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searchTerm: '',
  counter: 0,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchterm: (state, action) => {
      state.searchTerm = action.payload;
    },

    tick: (state) => {
      state.counter += 1;
    },
  },
});

export const searchActions = searchSlice.actions;

export default searchSlice.reducer;
