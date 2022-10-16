import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth';
import mainPageScrollReducer from './mainPageScroll';
import currentPostReducer from './currentPost';
import postListReducer from './postList';
import userProfileDataReducer from './userProfileData';
import searchReducer from './search';

const store = configureStore({
  reducer: {
    auth: authReducer,
    mainPageScroll: mainPageScrollReducer,
    currentPost: currentPostReducer,
    postList: postListReducer,
    userProfileData: userProfileDataReducer,
    search: searchReducer,
  },
});

export default store;
