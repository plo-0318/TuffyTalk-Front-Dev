import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth';
import mainPageScrollReducer from './mainPageScroll';

const store = configureStore({
  reducer: { auth: authReducer, mainPageScroll: mainPageScrollReducer },
});

export default store;
