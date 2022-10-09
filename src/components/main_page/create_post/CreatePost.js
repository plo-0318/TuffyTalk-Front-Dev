import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { RESOURCE_URL } from '../../../utils/config';

import classes from './CreatePost.module.css';
import commonClasses from '../../../utils/common.module.css';

const CreatePost = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);

  let userImage;

  if (user) {
    userImage =
      user.profilePicture === 'user-placeholder.png'
        ? `${RESOURCE_URL}/img/users/user-placeholder.png`
        : `${RESOURCE_URL}/img/users/${user._id}/${user.profilePicture}`;
  }

  return (
    <div
      className={`${commonClasses['main-container']} ${commonClasses['center-margin_bottom']} ${classes['create_post__main-container']}`}
    >
      {isAuthenticated ? (
        <div className={classes['create_post-container']}>
          <img src={userImage} alt='User' />
          <button>Share something...</button>
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
