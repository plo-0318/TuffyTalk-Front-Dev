import { useState, useCallback, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import LeaveCommentModal from './LeaveCommentModal';
import { postListActions } from '../../../../store/postList';
import { deleteTempUpload } from '../../../../utils/sendHttp';

import classes from './LeaveComment.module.css';
import boxClasses from '../../create_post/CreatePost.module.css';

const LeaveComment = (props) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [showCommentModal, setShowCommentModal] = useState(false);

  const userImage = user ? user.profilePicture : null;

  const leaveCommentHandler = () => {
    setShowCommentModal(true);
  };

  const closeCommentModal = useCallback(() => {
    setShowCommentModal(false);
  }, []);

  const commentSuccessHandler = useCallback(
    async (url) => {
      dispatch(postListActions.tick());
      await deleteTempUpload();
      navigate(0, { replace: true });
    },
    [navigate, dispatch]
  );

  return (
    <Fragment>
      {isAuthenticated && (
        <LeaveCommentModal
          show={showCommentModal}
          closeModal={closeCommentModal}
          onSuccess={commentSuccessHandler}
        />
      )}
      {isAuthenticated ? (
        <div
          className={`${boxClasses['create_post-container']} ${classes['leave_comment-container']}`}
        >
          <img src={userImage} alt='User' />
          <button onClick={leaveCommentHandler}>{`Leave a comment...`}</button>
        </div>
      ) : (
        <div
          className={`${boxClasses['create_post-container']} ${classes['leave_comment-container__no_user']}`}
        >
          <button
            onClick={() => {
              navigate('/signin');
            }}
          >{`Sign in to leave a comment...`}</button>
        </div>
      )}
    </Fragment>
  );
};

export default LeaveComment;
