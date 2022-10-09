import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import Modal from '../../../ui/modal/Modal';
import useHttp from '../../../../hooks/use-http';
import { sendHttp } from '../../../../utils/sendHttp';
import { UilThumbsUp } from '@iconscout/react-unicons';
import { RESOURCE_URL } from '../../../../utils/config';

import classes from './CommentItem.module.css';

const CommentContent = (props) => {
  props.comment.createdAt = new Date(
    props.comment.createdAt
  ).toLocaleDateString();

  const user = useSelector((state) => state.auth.user);

  const [userLike, setUserLike] = useState(
    user ? props.comment.likes.includes(user._id) : 0
  );
  const [commentLikes, setCommentLikes] = useState(
    props.comment.likes.length,
    null
  );
  const [modalState, setModalState] = useState({
    show: false,
    status: 'success',
    message: '',
  });

  const {
    sendRequest: toggleLikeComment,
    status,
    error,
  } = useHttp(sendHttp, false);

  const userImg =
    props.comment.author.profilePicture === 'user-placeholder.png'
      ? `${RESOURCE_URL}/img/users/user-placeholder.png`
      : `${RESOURCE_URL}/img/users/${props.comment.author._id}/${props.comment.author.profilePicture}`;

  const likeClickHandler = () => {
    if (!user) {
      setModalState({
        show: true,
        status: 'fail',
        message: 'Please log in to like a comment',
      });

      return;
    }

    if (status === 'pending' && !error) {
      return;
    }

    const submitOptions = {
      path: `/user-actions/toggle-like-comment/${props.comment._id}`,
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

  const closeModal = () => {
    setModalState((prevState) => {
      return { ...prevState, show: false };
    });
  };

  return (
    <React.Fragment>
      <Modal
        show={modalState.show}
        status={modalState.status}
        message={modalState.message}
        onConfirm={closeModal}
      />
      <div className={classes['comment_header-container']}>
        <div className={classes['left']}>
          <img src={userImg} alt='user' />
          <p>{props.comment.author.username}</p>
        </div>
        <div className={classes['right']}>
          <UilThumbsUp
            className={classes['comment_icon']}
            onClick={likeClickHandler}
          />
          <p>{commentLikes}</p>
        </div>
      </div>

      <p className={classes['comment_content']}>{props.comment.content}</p>

      <div className={classes['comment_footer-container']}>
        <p>{props.comment.createdAt}</p>
        {props.reply && <button>Reply</button>}
      </div>
    </React.Fragment>
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
