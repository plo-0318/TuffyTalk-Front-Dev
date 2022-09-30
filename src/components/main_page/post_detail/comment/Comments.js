import { useEffect } from 'react';

import useHttp from '../../../../hooks/use-http';
import { fetchData } from '../../../../utils/sendHttp';
import CommentItem from './CommentItem';
import LoadingSpinner from '../../../ui/loading_spinner/LoadingSpinner';

import classes from './Comments.module.css';

const Comments = (props) => {
  const { postId } = props;

  const { sendRequest, data: commentData, status, error } = useHttp(fetchData);

  useEffect(() => {
    sendRequest({
      path: `/comments?fromPost=${postId}&parentComment=`,
      useProxy: false,
    });
  }, [sendRequest, postId]);

  const noComments = (
    <div className={classes['no_comments-container']}>
      <p>no comments</p>
    </div>
  );

  return (
    <div className={classes['comments-container']}>
      <p className={classes['comments-title']}>Comments</p>
      <hr className={classes['comments__titile_divider']} />
      {status === 'completed' ? (
        commentData.length > 0 ? (
          commentData.map((comment) => (
            <CommentItem comment={comment} key={comment._id} />
          ))
        ) : (
          noComments
        )
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
};

export default Comments;
