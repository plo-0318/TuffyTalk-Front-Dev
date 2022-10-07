import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { UilPlus } from '@iconscout/react-unicons';

import UserInfo from './user_profile_items/profile/UserInfo';
import UserProfileSecurity from './user_profile_items/security/UserProfileSecurity';
import UserProfilePosts from './user_profile_items/user_posts/UserProfilePosts';

import classes from './UserProfile.module.css';
import commonClasses from '../../utils/common.module.css';

import userImg from '../../img/placeholder/user-placeholder.png';

const UserProfile = () => {
  const user = useSelector((state) => state.auth.user);
  const params = useParams();
  const navigate = useNavigate();

  const activeTab = params.tab;

  const profileBtnClickHandler = () => {
    navigate('/me/profile', { replace: true });
  };
  const securityBtnClickHandler = () => {
    navigate('/me/security', { replace: true });
  };
  const bookmarksBtnClickHandler = () => {
    navigate('/me/bookmarks', { replace: true });
  };
  const postsBtnClickHandler = () => {
    navigate('/me/posts', { replace: true });
  };

  return (
    <div
      className={`${commonClasses['main-container']} ${classes['user_profile-container']}`}
    >
      <div className={classes['user_profile-container__left']}>
        <div className={classes['user_img-container']}>
          <img src={userImg} alt='user' />
          <div className={classes['change_profile_pic-container']}>
            <UilPlus />
          </div>
        </div>
        <div className={classes['user_info-container']}>
          <p className={classes['user_name-text']}>{user.username}</p>
          <p className={classes['user_major-text']}>{user.major}</p>
        </div>
        <ul className={classes['btn-container']}>
          <li>
            <button
              className={`${classes['btn']} ${
                activeTab === 'profile' ? classes['btn__active'] : ''
              }`}
              onClick={profileBtnClickHandler}
            >
              Profile
            </button>
          </li>
          <li>
            <button
              className={`${classes['btn']} ${
                activeTab === 'security' ? classes['btn__active'] : ''
              }`}
              onClick={securityBtnClickHandler}
            >
              Security
            </button>
          </li>
          <li>
            <button
              className={`${classes['btn']} ${
                activeTab === 'bookmarks' ? classes['btn__active'] : ''
              }`}
              onClick={bookmarksBtnClickHandler}
            >
              Bookmarks
            </button>
          </li>
          <li>
            <button
              className={`${classes['btn']} ${
                activeTab === 'posts' ? classes['btn__active'] : ''
              }`}
              onClick={postsBtnClickHandler}
            >
              Posts
            </button>
          </li>
        </ul>
      </div>
      <div className={classes['user_profile-container__right']}>
        {activeTab === 'profile' && <UserInfo />}
        {activeTab === 'security' && <UserProfileSecurity />}
        {activeTab === 'bookmarks' && <UserProfilePosts type={'bookmark'} />}
        {activeTab === 'posts' && <UserProfilePosts type={'posts'} />}
      </div>
    </div>
  );
};

export default UserProfile;
