import { useDispatch } from 'react-redux';
import { useEffect, useCallback } from 'react';

import useHttp from './use-http';
import { authActions } from '../store/auth';
import { sendHttp } from '../utils/sendHttp';

const useFetchUserData = () => {
  const dispatch = useDispatch();

  const {
    sendRequest: fetchBookmarks,
    data: userBookmarks,
    status: bookmarkStatus,
    error: bookmarkError,
  } = useHttp(sendHttp);

  const {
    sendRequest: fetchLikedPosts,
    data: userLikedPosts,
    status: likedPostsStatus,
    error: likedPostsError,
  } = useHttp(sendHttp);

  useEffect(() => {
    if (
      bookmarkStatus === 'completed' &&
      !bookmarkError &&
      userBookmarks !== null
    ) {
      dispatch(authActions.setBookmarks(userBookmarks));
    }
  }, [bookmarkStatus, bookmarkError, userBookmarks, dispatch]);

  useEffect(() => {
    if (
      likedPostsStatus === 'completed' &&
      !likedPostsError &&
      userLikedPosts !== null
    ) {
      dispatch(authActions.setLikedPosts(userLikedPosts));
    }
  }, [likedPostsStatus, likedPostsError, userLikedPosts, dispatch]);

  const sendRequest = useCallback(() => {
    fetchBookmarks({ path: `/user-actions/my-bookmarks` });
    fetchLikedPosts({ path: `/user-actions/my-liked-posts` });
  }, [fetchBookmarks, fetchLikedPosts]);

  const completed =
    bookmarkStatus === 'completed' && likedPostsStatus === 'completed';

  return [sendRequest, completed];
};

export default useFetchUserData;
