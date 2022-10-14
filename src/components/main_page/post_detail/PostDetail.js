import { Fragment, useEffect, useState, memo, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { NavLink, useNavigate, useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import parse from 'html-react-parser';

import CreatePostModal from '../create_post/create_post_modal/CreatePostModal';
import ConfirmModal from '../../ui/modal/ConfirmModal';
import Modal from '../../ui/modal/Modal';

import LeaveComment from './comment_box/LeaveComment';
import Comments from './comment/Comments';
import useHttp from '../../../hooks/use-http';
import { sendHttp } from '../../../utils/sendHttp';
import LoadingSpinner from '../../ui/loading_spinner/LoadingSpinner';
import { authActions } from '../../../store/auth';
import { currentPostActions } from '../../../store/currentPost';
import { mainPageScrollActions } from '../../../store/mainPageScroll';
import { postListActions } from '../../../store/postList';
import { userProfileDataActions } from '../../../store/userProfileData';
import { RESOURCE_URL } from '../../../utils/config';
import {
  UilThumbsUp,
  UilCommentDots,
  UilBookmark,
} from '@iconscout/react-unicons';
import { camelToSpace, camelToDash } from '../../../utils/util';

import classes from './PostDetail.module.css';

const PostNotFound = () => {
  return (
    <div className={`${classes['post_modal-container']}`}>
      <div className={classes['post_not_found-container']}>
        <p className={classes['post_not_found-text']}>
          Could not load this post. This post either does not exist or has been
          deleted
        </p>
      </div>
    </div>
  );
};

const Backdrop = (props) => {
  const dispatch = useDispatch();

  const { sendRequest: toggleLikePost } = useHttp(sendHttp);

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
  const { postId, setUserLikeChanged, basePath } = props;

  const {
    sendRequest: fetchPostDetail,
    data: postData,
    status: postStatus,
    error: postError,
  } = useHttp(sendHttp);

  const {
    sendRequest: toggleBookmark,
    data: userData,
    status: toggleBookmarkStatus,
    error: toggleBookmarkError,
    resetState: resetToggleBookmark,
  } = useHttp(sendHttp, false);

  const {
    sendRequest: deletePost,
    status: deletePostStatus,
    error: deletePostError,
    resetState: resetDeletePost,
  } = useHttp(sendHttp, false);

  const [updatedPostData, setUpdatedPostData] = useState(false);
  const [userBookmark, setUserBookmark] = useState(false);

  const [userLike, setUserLike] = useState(null);
  const [postLikes, setPostLikes] = useState(0);

  const [isAuthor, setIsAuthor] = useState(false);
  const [showEditPost, setShowEditPost] = useState(false);

  const [modalState, setModalState] = useState({
    show: false,
    status: 'success',
    message: '',
  });
  const [confirmModalState, setConfirmModalState] = useState(false);

  const navigate = useNavigate();

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
      const userImg =
        postData.author.profilePicture === 'user-placeholder.png'
          ? `${RESOURCE_URL}/img/users/user-placeholder.png`
          : `${RESOURCE_URL}/img/users/${postData.author._id}/${postData.author.profilePicture}`;

      postData.author.userImg = userImg;
      postData.createdAt = new Date(postData.createdAt).toLocaleDateString();

      setPostLikes(postData.likes.length);

      if (user) {
        const userLikedPost = postData.likes.includes(user._id);
        setUserLike(userLikedPost);
        setIsAuthor(postData.author._id === user._id);
      }

      setUpdatedPostData(true);
    }
  }, [postStatus, postError, postData, user]);

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

  // Check if user has changed like post or not
  useEffect(() => {
    if (postStatus === 'completed' && updatedPostData && userLike !== null) {
      const changed = userLike !== postData.likes.includes(user._id);

      setUserLikeChanged(changed);
    }
  }, [
    postStatus,
    userLike,
    postData,
    user,
    setUserLikeChanged,
    updatedPostData,
  ]);

  // If author deleted post, go back to topic
  useEffect(() => {
    if (deletePostStatus === 'completed' && deletePostError) {
      setModalState({ show: true, status: 'fail', message: deletePostError });
      resetDeletePost();
    }

    if (deletePostStatus === 'completed' && !deletePostError) {
      dispatch(mainPageScrollActions.setDisableScroll(false));
      dispatch(postListActions.increase());
      // navigate(`/topic/${camelToDash(postData.topic.name)}`, { replace: true });

      if (basePath.startsWith('/me')) {
        dispatch(userProfileDataActions.removePost(postData));
      }
      navigate(basePath, { replace: true });
    }
  }, [
    deletePostStatus,
    deletePostError,
    resetDeletePost,
    navigate,
    postData,
    dispatch,
    basePath,
  ]);

  const bookmarkClickHandler = () => {
    if (!user) {
      setModalState({
        show: true,
        status: 'fail',
        message: 'Please log in to bookmark a post',
      });

      return;
    }

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
    if (!user) {
      setModalState({
        show: true,
        status: 'fail',
        message: 'Please log in to like a post',
      });

      return;
    }

    let likes = postLikes;

    if (!userLike) {
      setPostLikes((prevState) => prevState + 1);
      likes++;
    } else {
      setPostLikes((prevState) => prevState - 1);
      likes--;
    }

    dispatch(
      currentPostActions.setPostData({ postData: { likes }, id: postData._id })
    );
    dispatch(currentPostActions.setShouldUpdate(true));

    setUserLike((prevState) => !prevState);
  };

  const editPostClickHandler = () => {
    dispatch(mainPageScrollActions.setDisableScroll(true));
    setShowEditPost(true);
  };

  const deletePostClickHandler = () => {
    if (deletePostStatus === 'pending') {
      return;
    }

    setConfirmModalState({
      show: true,
      message: 'Are you sure you want to delete this post ?',
      onAccept: deletePostHandler,
      onDecline: closeModal.bind(null, 'confirm'),
      onClose: closeModal.bind(null, 'confirm'),
      acceptText: 'DELETE',
      declineText: 'BACK',
      btnColor: 'reverse',
    });
  };

  const deletePostHandler = () => {
    closeModal('confirm');

    const options = {
      path: `/user-actions/delete-post/${postData._id}`,
      useProxy: true,
      options: {
        method: 'DELETE',
        credentials: 'include',
      },
    };

    deletePost(options);
    setModalState({ show: true, status: 'pending', message: '' });
  };

  const closeEditPost = () => {
    setShowEditPost(false);
  };

  const closeModal = (modal = 'modal') => {
    if (modal === 'modal') {
      setModalState((prevState) => {
        return { ...prevState, show: false };
      });
    } else if (modal === 'confirm') {
      setConfirmModalState((prevState) => {
        return { ...prevState, show: false };
      });
    }
  };

  const editSuccessHandler = useCallback(() => {
    navigate(0, { replace: true });
  }, [navigate]);

  const readyToRender = postStatus === 'completed' && updatedPostData;

  if (postError) {
    return <PostNotFound />;
  }

  return (
    <Fragment>
      <ConfirmModal
        show={confirmModalState.show}
        message={confirmModalState.message}
        onAccept={confirmModalState.onAccept}
        onDecline={confirmModalState.onDecline}
        onClose={confirmModalState.onClose}
        declineText={confirmModalState.declineText}
        acceptText={confirmModalState.acceptText}
        btnColor={confirmModalState.btnColor}
      />
      <Modal
        show={modalState.show}
        status={modalState.status}
        message={modalState.message}
        onConfirm={closeModal.bind(null, 'modal')}
      />
      {isAuthor && (
        <CreatePostModal
          show={showEditPost}
          closeModal={closeEditPost}
          formHeight={'60rem'}
          onEditorReady={(editor) => editor.setData(postData.content)}
          isEdit={true}
          editData={{
            title: postData.title,
            postId: postData._id,
          }}
          onSuccess={editSuccessHandler}
        />
      )}
      <div
        className={`${classes['post_modal-container']} ${
          showEditPost ? classes['post_modal-container__no_scroll'] : ''
        }`}
      >
        {readyToRender ? (
          <Fragment>
            <div className={classes['post_detail-container']}>
              <div className={classes['user_info-container']}>
                <img src={postData.author.userImg} alt='user' />
                <p>{postData.author.username}</p>
              </div>

              <p className={classes['post_detail__title']}>{postData.title}</p>

              <div className={classes['post_info-container']}>
                <NavLink
                  to={`/topic/${camelToDash(postData.topic.name)}`}
                  className={classes['topic-link']}
                >
                  {camelToSpace(postData.topic.name)}
                </NavLink>
                <p>{postData.createdAt}</p>
              </div>

              {/* <p className={classes['post_detail__content']}>
                {postData.content}
              </p> */}

              <div className={classes['post_detail__content-container']}>
                {parse(postData.content)}
              </div>

              <div className={classes['post_footer-container']}>
                <div className={classes['post_footer__left-container']}>
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
                {isAuthor && (
                  <div className={classes['post_footer__right-container']}>
                    <button
                      className={classes['edit-btn']}
                      onClick={editPostClickHandler}
                    >
                      Edit
                    </button>
                    <button
                      className={classes['delete-btn']}
                      onClick={deletePostClickHandler}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
            <LeaveComment />
            <Comments postId={postData._id} />
          </Fragment>
        ) : (
          <LoadingSpinner />
        )}
      </div>
    </Fragment>
  );
});

const PostDetail = (props) => {
  const [userLikePostChanged, setUserLikePostChanged] = useState(false);
  const navigate = useNavigate();

  const { postId, topicName } = useParams();

  const paths = useLocation().pathname.split('/');
  const basePath = `/${paths[1]}/${paths[2]}`;

  const options = basePath.startsWith('/topic')
    ? { state: { restoreScroll: true } }
    : {};

  const onBackdropClick = () => {
    navigate(basePath, options);
  };

  return (
    <Fragment>
      {ReactDOM.createPortal(
        <Backdrop
          // onBackdropClick={props.onBackdropClick}
          onBackdropClick={onBackdropClick}
          userLikePostChanged={userLikePostChanged}
          postId={postId}
        />,
        document.getElementById('backdrop-root')
      )}
      {ReactDOM.createPortal(
        <PostModal
          postId={postId}
          setUserLikeChanged={setUserLikePostChanged}
          basePath={basePath}
        />,
        document.getElementById('overlay-root')
      )}
    </Fragment>
  );
};

export default PostDetail;
