import React, { useState } from 'react';

import useHttp from '../../../../hooks/use-http';
import { fetchData } from '../../../../utils/sendHttp';
import { UilThumbsUp } from '@iconscout/react-unicons';

import classes from './CommentItem.module.css';
import userImg from '../../../../img/placeholder/user-placeholder.png';

const CommentContent = (props) => {
  props.comment.createdAt = new Date(
    props.comment.createdAt
  ).toLocaleDateString();

  // Temporary
  props.comment.author.profilePicture = userImg;

  return (
    <React.Fragment>
      <div className={classes['comment_header-container']}>
        <div className={classes['left']}>
          <img src={props.comment.author.profilePicture} alt='user' />
          <p>{props.comment.author.username}</p>
        </div>
        <div className={classes['right']}>
          <UilThumbsUp className={classes['comment_icon']} />
          <p>{props.comment.likes}</p>
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
  } = useHttp(fetchData);

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
