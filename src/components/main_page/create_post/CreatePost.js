import { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

import { mainPageScrollActions } from '../../../store/mainPageScroll';
import { postListActions } from '../../../store/postList';
import { toCamel, camelToSpace } from '../../../utils/util';
import CreatePostModal from './create_post_modal/CreatePostModal';
import { deleteTempUpload } from '../../../utils/sendHttp';

import classes from './CreatePost.module.css';
import commonClasses from '../../../utils/common.module.css';

const CreatePost = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const location = useLocation();
  const paths = location.pathname.split('/');

  const currentTopic =
    paths[paths.length - 1] === ''
      ? paths[paths.length - 2]
      : paths[paths.length - 1];

  const [showCreatePost, setShowCreatePost] = useState(false);

  const userImage = user ? user.profilePicture : null;

  const createPostHandler = () => {
    // dispatch(mainPageScrollActions.setDisableScroll(true));
    setShowCreatePost(true);
  };

  const closeCreatePost = useCallback(() => {
    // dispatch(mainPageScrollActions.setDisableScroll(false));
    setShowCreatePost(false);
  }, []);

  const postSuccessHandler = useCallback(
    async (url) => {
      // dispatch(mainPageScrollActions.setDisableScroll(false));
      dispatch(mainPageScrollActions.resetScrollPosition());
      dispatch(postListActions.increase());
      closeCreatePost();
      await deleteTempUpload();
      navigate(url, { replace: true });
    },
    [closeCreatePost, navigate, dispatch]
  );

  return (
    <div
      className={`${commonClasses['main-container']} ${commonClasses['center-margin_bottom']} ${classes['create_post__main-container']}`}
    >
      {isAuthenticated && (
        <CreatePostModal
          show={showCreatePost}
          closeModal={closeCreatePost}
          topic={toCamel(currentTopic, '-')}
          onSuccess={postSuccessHandler}
        />
      )}
      {isAuthenticated ? (
        <div className={classes['create_post-container']}>
          <img src={userImage} alt="User" />
          <button
            onClick={createPostHandler}
          >{`Share something in ${camelToSpace(
            toCamel(currentTopic, '-')
          )}...`}</button>
        </div>
      ) : (
        <div className={classes['no_user-container']}>
          <NavLink to={'/signin'} className={classes['signin_link']}>
            Sign in
          </NavLink>
          <p>to create a post...</p>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
