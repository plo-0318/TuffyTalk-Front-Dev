import { useEffect, memo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { RESOURCE_URL } from '../../../utils/config';
import { currentPostActions } from '../../../store/currentPost';
import { mainPageScrollActions } from '../../../store/mainPageScroll';
import {
  UilThumbsUp,
  UilCommentDots,
  UilBookmark,
} from '@iconscout/react-unicons';

import classes from './PostItem.module.css';

const PostItem = (props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [postData, setPostData] = useState({
    ...props.post,
    likes: props.post.likes.length,
    createdAt: new Date(props.post.createdAt).toLocaleDateString(),
  });

  const {
    postData: postStateData,
    id: postStateId,
    shouldUpdate,
  } = useSelector((state) => state.currentPost);

  const dispatch = useDispatch();

  useEffect(() => {
    if (postStateId === postData._id && shouldUpdate) {
      setPostData((prevState) => {
        return { ...prevState, ...postStateData };
      });
      dispatch(currentPostActions.resetState());
    }
  }, [postStateData, postStateId, shouldUpdate, postData, dispatch]);

  const hasImage = postData.images.length > 0;
  const titleContentClasses = `${classes['title_content-container']} ${
    hasImage ? '' : classes['title_content-container__no_img']
  }`;

  const postImg = hasImage
    ? `${RESOURCE_URL}/img/users/${postData.author._id}/posts/${postData._id}/${postData.images[0]}`
    : null;

  const postClickHandler = () => {
    dispatch(mainPageScrollActions.setDisableScroll(true));
    dispatch(mainPageScrollActions.saveScrollPosition());
    navigate(`${location.pathname}/post/${postData._id}`);
  };

  const userImg =
    postData.author.profilePicture === 'user-placeholder.png'
      ? `${RESOURCE_URL}/img/users/user-placeholder.png`
      : `${RESOURCE_URL}/img/users/${postData.author._id}/${postData.author.profilePicture}`;

  const pRegex = /(?<=(<p>)\s*).*?(?=\s*<)/s;
  const liRegex = /(?<=(<li>)\s*).*?(?=\s*<)/s;

  const p = postData.content.match(pRegex);
  const li = postData.content.match(liRegex);

  let content = p ? p[0] : li ? li[0] : '';

  return (
    <div className={classes['post-container']} onClick={postClickHandler}>
      <div className={classes['header-container']}>
        <div className={classes['header__picture_name-container']}>
          <img src={userImg} alt='user' />
          <p className={classes['username']}>{postData.author.username}</p>
        </div>
        <p>{postData.createdAt}</p>
      </div>

      <div className={classes['main_content-container']}>
        <div className={titleContentClasses}>
          <p className={classes['title-text']}>{postData.title}</p>
          <p className={classes['content-text']}>{content}</p>
          <div className={classes['footer-container']}>
            <UilThumbsUp className={classes['footer-icon']} />
            <p>{postData.likes}</p>
            <UilCommentDots className={classes['footer-icon']} />
            <p>{postData.comments.length}</p>
            {props.bookmark && (
              <UilBookmark className={classes['footer-icon']} />
            )}
          </div>
        </div>
        {hasImage && (
          <div className={classes['post_img-container']}>
            <img src={postImg} alt='post' />
          </div>
        )}
      </div>

      <hr className={classes['post_item__divider']} />
    </div>
  );
};

export default memo(PostItem);
