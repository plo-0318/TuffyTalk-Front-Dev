import React, { useState, useEffect, Fragment, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import parse from 'html-react-parser';

import ConfirmModal from '../../../ui/modal/ConfirmModal';
import LeaveCommentModal from '../comment_box/LeaveCommentModal';
import Modal from '../../../ui/modal/Modal';
import useHttp from '../../../../hooks/use-http';
import { sendHttp } from '../../../../utils/sendHttp';
import { UilThumbsUp } from '@iconscout/react-unicons';
import { RESOURCE_URL } from '../../../../utils/config';
import { postListActions } from '../../../../store/postList';

import classes from './CommentItem.module.css';
import userPlaceholderImg from '../../../../img/placeholder/user-placeholder.png';

const CommentDeleted = () => {
  return (
    <Fragment>
      <div className={classes['comment_header-container']}>
        <div className={classes['left']}>
          <img src={userPlaceholderImg} alt='user' />
          <p>Deleted</p>
        </div>
      </div>

      <div className={classes['comment_content-container']}>
        <p className={classes['comment_content__deleted']}>
          This comment has been deleted
        </p>
      </div>
    </Fragment>
  );
};

const CommentContent = (props) => {
  const { comment: commentData } = props;

  commentData.createdAt = new Date(commentData.createdAt).toLocaleDateString();

  const user = useSelector((state) => state.auth.user);

  const [isAuthor, setIsAuthor] = useState(false);
  const [userLike, setUserLike] = useState(
    user ? commentData.likes.includes(user._id) : 0
  );
  const [commentLikes, setCommentLikes] = useState(
    commentData.likes.length,
    null
  );
  const [modalState, setModalState] = useState({
    show: false,
    status: 'success',
    message: '',
  });
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentModalData, setCommentModalData] = useState({});
  const [confirmModalState, setConfirmModalState] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    sendRequest: toggleLikeComment,
    status: toggleLikeCommentStatus,
    error: toggleLikeCommentError,
  } = useHttp(sendHttp, false);

  const {
    sendRequest: deleteComment,
    status: deleteCommentStatus,
    error: deleteCommentError,
    resetState: resetDeleteComment,
  } = useHttp(sendHttp, false);

  useEffect(() => {
    if (!user) {
      return;
    }

    if (commentData.author._id === user._id) {
      setIsAuthor(true);
    }
  }, [commentData, user]);

  useEffect(() => {
    if (deleteCommentStatus === 'completed') {
      if (deleteCommentError) {
        setModalState({
          show: true,
          status: 'fail',
          message: deleteCommentError,
        });
        resetDeleteComment();
        return;
      }

      dispatch(postListActions.increase());
      resetDeleteComment();
      navigate(0, { replace: true });
    }
  }, [
    deleteCommentStatus,
    deleteCommentError,
    resetDeleteComment,
    navigate,
    dispatch,
  ]);

  const userImg =
    commentData.author.profilePicture === 'user-placeholder.png'
      ? `${RESOURCE_URL}/img/users/user-placeholder.png`
      : `${RESOURCE_URL}/img/users/${commentData.author._id}/${commentData.author.profilePicture}`;

  const likeClickHandler = () => {
    if (!user) {
      setModalState({
        show: true,
        status: 'fail',
        message: 'Sign in to like a comment',
      });

      return;
    }

    if (toggleLikeCommentStatus === 'pending' && !toggleLikeCommentError) {
      return;
    }

    const submitOptions = {
      path: `/user-actions/toggle-like-comment/${commentData._id}`,
      useProxy: true,
      options: {
        method: 'PATCH',
        credentials: 'include',
      },
    };

    toggleLikeComment(submitOptions);

    if (!userLike) {
      setCommentLikes((prevState) => prevState + 1);
    } else {
      setCommentLikes((prevState) => prevState - 1);
    }
  };

  const replyClickHandler = () => {
    if (!user) {
      setModalState({
        show: true,
        status: 'fail',
        message: 'Sign in to reply to a comment',
      });

      return;
    }

    setCommentModalData({
      fromParent: commentData._id,
    });
    setShowCommentModal(true);
  };

  const editClickHandler = () => {
    setCommentModalData({
      isEdit: true,
      onEditorReady: (editor) => editor.setData(commentData.content),
      editData: { commentId: commentData._id },
    });

    setShowCommentModal(true);
  };

  const deleteClickHandler = () => {
    if (deleteCommentStatus === 'pending') {
      return;
    }

    setConfirmModalState({
      show: true,
      message: 'Are you sure you want to delete this comment ?',
      onAccept: deleteCommentHandler,
      onDecline: closeModal.bind(null, 'confirm'),
      onClose: closeModal.bind(null, 'confirm'),
      acceptText: 'DELETE',
      declineText: 'BACK',
      btnColor: 'reverse',
    });
  };

  const deleteCommentHandler = () => {
    closeModal('confirm');

    const options = {
      path: `/user-actions/delete-comment/${commentData._id}`,
      useProxy: true,
      options: {
        method: 'DELETE',
        credentials: 'include',
      },
    };

    deleteComment(options);
    setModalState({ show: true, status: 'pending', message: '' });
  };

  const closeCommentModal = useCallback(() => {
    setShowCommentModal(false);
  }, []);

  const commentSuccessHandler = useCallback(() => {
    navigate(0, { replace: true });
  }, [navigate]);

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

  if (commentData.deleted) {
    return <CommentDeleted />;
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
      <LeaveCommentModal
        show={showCommentModal}
        closeModal={closeCommentModal}
        containerHeight={'60rem'}
        onSuccess={commentSuccessHandler}
        isEdit={commentModalData.isEdit}
        onEditorReady={commentModalData.onEditorReady}
        editData={commentModalData.editData}
        fromParent={commentModalData.fromParent}
      />
      <div className={classes['comment_header-container']}>
        <div className={classes['left']}>
          <img src={userImg} alt='user' />
          <p>{commentData.author.username}</p>
        </div>
        <div className={classes['right']}>
          <UilThumbsUp
            className={classes['comment_icon']}
            onClick={likeClickHandler}
          />
          <p>{commentLikes}</p>
        </div>
      </div>

      <div className={classes['comment_content-container']}>
        {parse(commentData.content)}
      </div>

      <div className={classes['comment_footer-container']}>
        <div className={classes['user_action-container']}>
          <p>{commentData.createdAt}</p>
          {isAuthor && (
            <Fragment>
              <button
                className={`${classes['user_action-btn']} ${classes['edit-btn']}`}
                onClick={editClickHandler}
              >
                Edit
              </button>
              <button
                className={`${classes['user_action-btn']} ${classes['delete-btn']}`}
                onClick={deleteClickHandler}
              >
                Delete
              </button>
            </Fragment>
          )}
        </div>
        {props.reply && (
          <button
            className={`${classes['user_action-btn']}`}
            onClick={replyClickHandler}
          >
            Reply
          </button>
        )}
      </div>
    </Fragment>
  );
};

const CommentItem = (props) => {
  const [childComments, setChildComments] = useState([]);
  const [displayChildComments, setDisplayChildComments] = useState(false);

  const {
    sendRequest,
    data: childCommentData,
    status,
    error,
  } = useHttp(sendHttp);

  const { comment } = props;

  const toggleChildComments = async () => {
    if (comment.comments <= 0) {
      return;
    }

    // If not currently displaying child comments AND havn't loaded child comments yet
    if (!displayChildComments && childComments.length <= 0) {
      // Load child comments
      await sendRequest({
        path: `/comments?parentComment=${comment._id}`,
        useProxy: false,
      });
    }

    // Toggle display child comments
    setDisplayChildComments((prevState) => !prevState);
  };

  return (
    <div className={classes['comment_item-container']}>
      <CommentContent comment={comment} reply={true} />

      {comment.comments.length > 0 && (
        <div className={classes['bottom']}>
          <hr className={classes['bottom__divider']} />
          <button onClick={toggleChildComments}>
            {displayChildComments
              ? 'hide comments'
              : `${comment.comments.length} more comments`}
          </button>
        </div>
      )}

      {displayChildComments && (
        <div className={classes['child_comments-container']}>
          {childCommentData.map((comment) => (
            <div key={comment._id}>
              <CommentContent comment={comment} reply={false} />
            </div>
          ))}
        </div>
      )}
      {/* <hr className={classes['comment_item__divider']} /> */}
    </div>
  );
};

export default React.memo(CommentItem);
