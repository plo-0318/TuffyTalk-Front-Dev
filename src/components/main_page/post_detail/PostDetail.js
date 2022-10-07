import { Fragment, useEffect, useState, memo } from 'react';
import ReactDOM from 'react-dom';
import { NavLink, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { mainPageScrollActions } from '../../../store/mainPageScroll';

import Comments from './comment/Comments';
import useHttp from '../../../hooks/use-http';
import { fetchData } from '../../../utils/sendHttp';
import LoadingSpinner from '../../ui/loading_spinner/LoadingSpinner';
import { authActions } from '../../../store/auth';

import {
  UilThumbsUp,
  UilCommentDots,
  UilBookmark,
} from '@iconscout/react-unicons';
import classes from './PostDetail.module.css';

import userImg from '../../../img/placeholder/user-placeholder.png';

const Backdrop = (props) => {
  const dispatch = useDispatch();

  const { sendRequest: toggleLikePost } = useHttp(fetchData);

  const backdropClickHandler = () => {
    dispatch(mainPageScrollActions.setDisableScroll(false));

    if (props.userLikePostChanged) {
      const submitOptions = {
        path: `/user-actions/toggle-like-post/${props.postId}`,
        useProxy: true,
        options: {
          method: 'PATCH',
          credentials: 'include',
        },
      };

      toggleLikePost(submitOptions);
    }

    props.onBackdropClick();
  };

  return (
    <div
      className={classes['modal_backdrop']}
      onClick={backdropClickHandler}
    ></div>
  );
};

const PostModal = memo((props) => {
  const { postId, setUserLikeChanged } = props;

  const {
    sendRequest: fetchPostDetail,
    data: postData,
    status: postStatus,
    error: postError,
  } = useHttp(fetchData);

  const {
    sendRequest: toggleBookmark,
    data: userData,
    status: toggleBookmarkStatus,
    error: toggleBookmarkError,
    resetState: resetToggleBookmark,
  } = useHttp(fetchData, false);

  const [updatedPostData, setUpdatedPostData] = useState(false);
  const [userBookmark, setUserBookmark] = useState(false);
  const [userLike, setUserLike] = useState(null);
  const [postLikes, setPostLikes] = useState(0);

  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  // Check if user has bookmarked this page
  useEffect(() => {
    if (user) {
      const hasBookmark = user.bookmarks.includes(postId);

      if (userBookmark === hasBookmark) {
        return;
      }

      setUserBookmark(hasBookmark);
    }
  }, [user, postId, userBookmark]);

  // Update the page after user toggled bookmark
  useEffect(() => {
    if (toggleBookmarkStatus === 'completed' && !toggleBookmarkError) {
      setUserBookmark((prevState) => !prevState);

      const updatedUser = { ...userData };

      resetToggleBookmark();
      dispatch(authActions.setUser(updatedUser));
    }
  }, [
    toggleBookmarkStatus,
    resetToggleBookmark,
    toggleBookmarkError,
    userData,
    dispatch,
  ]);

  // Load the post detail and comments from backend
  useEffect(() => {
    fetchPostDetail({ path: `/posts/${postId}`, useProxy: false });
  }, [fetchPostDetail, postId]);

  // After successfuly fetched post detail
  // Format the post create time
  // Use the plcaeholder user profile pic
  // Then allow render
  useEffect(() => {
    if (postStatus === 'completed' && !postError) {
      postData.author.profilePicture = userImg;
      postData.createdAt = new Date(postData.createdAt).toLocaleDateString();

      setPostLikes(postData.likes.length);

      if (user) {
        const userLikedPost = postData.likes.includes(user._id);
        setUserLike(userLikedPost);
      }

      setUpdatedPostData(true);
    }
  }, [postStatus, postError, postData, user]);

  // Check if user has changed like post or not
  useEffect(() => {
    if (postStatus === 'completed' && userLike !== null) {
      const chagned = userLike !== postData.likes.includes(user._id);

      setUserLikeChanged(chagned);
    }
  }, [postStatus, userLike, postData, user, setUserLikeChanged]);

  const readyToRender = postStatus === 'completed' && updatedPostData;

  const bookmarkClickHandler = () => {
    if (toggleBookmarkStatus === 'pending') {
      return;
    }

    const fetchOptions = {
      path: '/user-actions/toggle-bookmark',
      useProxy: true,
      options: {
        method: 'PATCH',
        credentials: 'include',
        body: JSON.stringify({ postId }),
        headers: { 'Content-Type': 'application/json' },
      },
    };

    toggleBookmark(fetchOptions);
  };

  const postLikeClickHandler = () => {
    if (!userLike) {
      setPostLikes((prevState) => prevState + 1);
    } else {
      setPostLikes((prevState) => prevState - 1);
    }

    setUserLike((prevState) => !prevState);
  };

  return (
    <div className={`${classes['post_modal-container']}`}>
      {readyToRender ? (
        <Fragment>
          <div className={classes['post_detail-container']}>
            <div className={classes['user_info-container']}>
              <img src={postData.author.profilePicture} alt='user' />
              <p>{postData.author.username}</p>
            </div>

            <p className={classes['post_detail__title']}>{postData.title}</p>

            <div className={classes['post_info-container']}>
              <NavLink to={'/'} className={classes['topic-link']}>
                {postData.topic.name
                  .split(' ')
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')}
              </NavLink>
              <p>{postData.createdAt}</p>
            </div>

            <p className={classes['post_detail__content']}>
              {postData.content}
            </p>

            <div className={classes['post_footer-container']}>
              <UilThumbsUp
                className={
                  userLike
                    ? classes['post_footer__icon']
                    : `${classes['post_footer__icon']} ${classes['post_footer__icon__inactive']}`
                }
                onClick={postLikeClickHandler}
              />
              <p>{postLikes}</p>

              <UilCommentDots
                className={`${classes['post_footer__icon']} ${classes['post_footer__icon__inactive']}`}
              />
              <p>{postData.comments.length}</p>

              <UilBookmark
                className={
                  userBookmark
                    ? classes['post_footer__icon']
                    : `${classes['post_footer__icon']} ${classes['post_footer__icon__inactive']}`
                }
                onClick={bookmarkClickHandler}
              />
            </div>
          </div>

          <Comments postId={postData._id} />
        </Fragment>
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
});

const PostDetail = (props) => {
  const location = useLocation();
  const [userLikePostChanged, setUserLikePostChanged] = useState(false);

  const postId = location.pathname.split('/').at(-1);

  return (
    <Fragment>
      {ReactDOM.createPortal(
        <Backdrop
          onBackdropClick={props.onBackdropClick}
          userLikePostChanged={userLikePostChanged}
          postId={postId}
        />,
        document.getElementById('backdrop-root')
      )}
      {ReactDOM.createPortal(
        <PostModal
          postId={postId}
          setUserLikeChanged={setUserLikePostChanged}
        />,
        document.getElementById('overlay-root')
      )}
    </Fragment>
  );
};

export default PostDetail;
