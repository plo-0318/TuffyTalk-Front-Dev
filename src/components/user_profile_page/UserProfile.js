import { Fragment, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { UilPlus } from '@iconscout/react-unicons';

import { authActions } from '../../store/auth';
import { RESOURCE_URL } from '../../utils/config';
import useHttp from '../../hooks/use-http';
import { sendHttp } from '../../utils/sendHttp';
import UserInfo from './user_profile_items/profile/UserInfo';
import UserProfileSecurity from './user_profile_items/security/UserProfileSecurity';
import UserProfilePosts from './user_profile_items/user_posts/UserProfilePosts';
import Modal from '../ui/modal/Modal';
import ErrorPage from '../error_page/ErrorPage';

import classes from './UserProfile.module.css';
import commonClasses from '../../utils/common.module.css';

const UserProfile = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const params = useParams();
  const navigate = useNavigate();

  const [modalState, setModalState] = useState({
    show: false,
    status: 'success',
    message: '',
  });

  const activeTab = params.tab;

  const {
    sendRequest: uploadPicture,
    status: uploadPictureStatus,
    data: updatedUserData,
    error: uploadPictureError,
    resetState: resetUploadPicture,
  } = useHttp(sendHttp, false);

  useEffect(() => {
    if (uploadPictureStatus === 'completed' && uploadPictureError) {
      resetUploadPicture();
      setModalState({
        show: true,
        status: 'fail',
        message: uploadPictureError,
      });
      return;
    }

    if (uploadPictureStatus === 'completed' && !uploadPictureError) {
      dispatch(authActions.setUser(updatedUserData));
      resetUploadPicture();
      setModalState({ show: true, status: 'success', message: 'Change Saved' });
    }
  }, [
    updatedUserData,
    uploadPictureStatus,
    uploadPictureError,
    resetUploadPicture,
    dispatch,
    navigate,
  ]);

  if (!user) {
    return <ErrorPage message={'Please sign in to view this page'} />;
  }

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

  const profilePicChangeHandler = (e) => {
    if (uploadPictureStatus === 'pending') {
      return;
    }

    const form = new FormData();

    form.append('image', e.target.files[0]);

    const submitOptions = {
      path: '/user-actions/update-me',
      useProxy: false,
      options: {
        method: 'PATCH',
        credentials: 'include',
        body: form,
      },
    };

    uploadPicture(submitOptions);
    setModalState({ show: true, status: 'pending', message: '' });
  };

  const userImg =
    user.profilePicture === 'user-placeholder.png'
      ? `${RESOURCE_URL}/img/users/user-placeholder.png`
      : `${RESOURCE_URL}/img/users/${user._id}/${user.profilePicture}`;

  const closeModal = () => {
    setModalState((prevState) => {
      return { ...prevState, show: false };
    });

    if (!uploadPictureError) {
      navigate(0);
    }
  };

  return (
    <Fragment>
      <Modal
        show={modalState.show}
        status={modalState.status}
        message={modalState.message}
        onConfirm={closeModal}
      />
      <div
        className={`${commonClasses['main-container']} ${classes['user_profile-container']}`}
      >
        <div className={classes['user_profile-container__left']}>
          <div className={classes['user_img-container']}>
            <img src={userImg} alt='user' />
            <div className={classes['change_profile_pic-container']}>
              <label htmlFor='profile-pic'>
                <UilPlus className={classes['change_procile_pic-icon']} />
              </label>
              <input
                id='profile-pic'
                type='file'
                name='profile-picture'
                accept='image/*'
                onChange={profilePicChangeHandler}
              />
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
    </Fragment>
  );
};

export default UserProfile;
