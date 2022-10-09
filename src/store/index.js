import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth';
import mainPageScrollReducer from './mainPageScroll';
import currentPostReducer from './currentPost';

const store = configureStore({
  reducer: {
    auth: authReducer,
    mainPageScroll: mainPageScrollReducer,
    currentPost: currentPostReducer,
  },
});

export default store;
