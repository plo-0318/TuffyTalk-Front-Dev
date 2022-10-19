import { Fragment, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

import useHttp from '../../../../hooks/use-http';
import { sendHttp } from '../../../../utils/sendHttp';
import { RESOURCE_URL } from '../../../../utils/config';
import { camelToSpace } from '../../../../utils/util';
import LoadingSpinner from '../../../ui/loading_spinner/LoadingSpinner';
import { userProfileDataActions } from '../../../../store/userProfileData';

import classes from './UserProfilePosts.module.css';
import profileClasses from '../ProfileItemCommon.module.css';

const BookmarkItem = (props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const post = { ...props.postData };

  const bookmarkClickHandler = () => {
    navigate(`${location.pathname}/${post._id}`);
  };

  return (
    <li
      className={classes['bookmark_item-container']}
      onClick={bookmarkClickHandler}
    >
      <div className={classes['bookmark_item__header-container']}>
        <img
          src={`${RESOURCE_URL}/img/topics/${post.topic.icon}`}
          alt="topic"
        />
        <p className={classes['bookmark_item__topic-text']}>
          {camelToSpace(post.topic.name)}
        </p>
        <p className={classes['bookmark_item__createdAt-text']}>
          {new Date(post.createdAt).toLocaleDateString()}
        </p>
      </div>
      <div className={classes['bookmark_item__title-wrapper']}>
        <p className={classes['bookmark_item__title-text']}>{post.title}</p>
      </div>
    </li>
  );
};

const ProfilePostContent = (props) => {
  const { postData } = props;

  if (postData.length > 0) {
    return postData.map((post) => (
      <BookmarkItem key={post._id} postData={post} />
    ));
  }

  return (
    <div className={classes['no_content-container']}>
      <p>No Bookmarks</p>
    </div>
  );
};

const UserProfilePosts = (props) => {
  const user = useSelector((state) => state.auth.user);
  const postDataState = useSelector((state) => state.userProfileData.posts);

  const [readyToRender, setReadyToRender] = useState(false);

  const dispatch = useDispatch();

  const { type } = props;

  const {
    sendRequest: fetchPosts,
    status,
    data: postsData,
    error,
  } = useHttp(sendHttp);

  useEffect(() => {
    const path =
      type === 'bookmark'
        ? '/user-actions/get-my-bookmarked-posts'
        : '/user-actions/get-my-posts';

    fetchPosts({
      path,
      options: {
        method: 'GET',
        credentials: 'include',
      },
    });
  }, [fetchPosts, type, user]);

  useEffect(() => {
    if (readyToRender) {
      return;
    }

    if (status === 'completed' && !error && postsData) {
      dispatch(userProfileDataActions.setPosts(postsData));

      setReadyToRender(true);
    }
  }, [status, postsData, error, dispatch, readyToRender]);

  const titleText = type === 'bookmark' ? 'Bookmarks' : 'Posts';

  return (
    <Fragment>
      <div className={profileClasses['user_info-container']}>
        <div className={profileClasses['user_info_header-container']}>
          <p>{titleText}</p>
        </div>
      </div>
      <div className={classes['bookmarks-container']}>
        {status === 'completed' && readyToRender ? (
          <ul className={classes['bookmarks_background-container']}>
            <ProfilePostContent postData={postDataState} />
          </ul>
        ) : (
          <LoadingSpinner />
        )}
      </div>
      <Outlet />
    </Fragment>
  );
};

export default UserProfilePosts;
