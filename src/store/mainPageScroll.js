import { createSlice } from '@reduxjs/toolkit';

const initialScrollState = { disableScroll: false };

const mainPageScrollSlice = createSlice({
  name: 'mainPageScroll',
  initialState: initialScrollState,
  reducers: {
    setDisableScroll(state, action) {
      state.disableScroll = action.payload;
    },
  },
});

export const mainPageScrollActions = mainPageScrollSlice.actions;

export default mainPageScrollSlice.reducer;
