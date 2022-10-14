import { createSlice } from '@reduxjs/toolkit';

const initialScrollState = { disableScroll: false, scrollPosition: 0 };

const mainPageScrollSlice = createSlice({
  name: 'mainPageScroll',
  initialState: initialScrollState,
  reducers: {
    setDisableScroll(state, action) {
      state.disableScroll = action.payload;
    },

    saveScrollPosition(state) {
      state.scrollPosition = window.scrollY;
    },

    resetScrollPosition(state) {
      state.scrollPosition = 0;
    },
  },
});

export const mainPageScrollActions = mainPageScrollSlice.actions;

export default mainPageScrollSlice.reducer;
