import { Fragment, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { NavLink, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { mainPageScrollActions } from '../../../store/mainPageScroll';

import Comments from './comment/Comments';
import useHttp from '../../../hooks/use-http';
import { fetchData } from '../../../utils/sendHttp';
import LoadingSpinner from '../../ui/loading_spinner/LoadingSpinner';

import { UilThumbsUp } from '@iconscout/react-unicons';
import { UilCommentDots } from '@iconscout/react-unicons';
import classes from './PostDetail.module.css';

import userImg from '../../../img/placeholder/user-placeholder.png';

const Backdrop = (props) => {
  const dispatch = useDispatch();

  const backdropClickHandler = () => {
    dispatch(mainPageScrollActions.setDisableScroll(false));
    props.onBackdropClick();
  };

  return (
    <div
      className={classes['modal_backdrop']}
      onClick={backdropClickHandler}
    ></div>
  );
};

const PostModal = (props) => {
  const { postId } = props;

  const { sendRequest, data: postData, status, error } = useHttp(fetchData);
  const [updatedPostData, setUpdatedPostData] = useState(false);

  useEffect(() => {
    sendRequest({ path: `/posts/${postId}`, useProxy: false });
  }, [sendRequest, postId]);

  useEffect(() => {
    if (status === 'completed' && !error) {
      postData.author.profilePicture = userImg;
      postData.createdAt = new Date(postData.createdAt).toLocaleDateString();

      setUpdatedPostData(true);
    }
  }, [status, error, postData]);

  const readyToRender = status === 'completed' && updatedPostData;

  return (
    <div className={`${classes['post_modal-container']}`}>
      {readyToRender ? (
        <Fragment>
          <div className={classes['post_detail-container']}>
            <div className={classes['user_info-container']}>
              <img src={postData.author.profilePicture} alt='user' />
              <p>{postData.author.username}</p>
            </div>

            <p className={classes['post_detail__title']}>{postData.title}</p>

            <div className={classes['post_info-container']}>
              <NavLink to={'/'} className={classes['topic-link']}>
                {postData.topic.name
                  .split(' ')
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')}
              </NavLink>
              <p>{postData.createdAt}</p>
            </div>

            <p className={classes['post_detail__content']}>
              {postData.content}
            </p>

            <div className={classes['post_footer-container']}>
              <UilThumbsUp
                className={`${classes['post_footer__icon']} ${classes['post_footer__icon_heart']}`}
              />
              <p>{postData.likes}</p>
              <UilCommentDots
                className={`${classes['post_footer__icon']} ${classes['post_footer__icon_comment']}`}
              />
              <p>{postData.numComments}</p>
            </div>
          </div>

          <Comments postId={postData._id} />
        </Fragment>
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
};

const PostDetail = (props) => {
  const location = useLocation();

  const postId = location.pathname.split('/').at(-1);

  return (
    <Fragment>
      {ReactDOM.createPortal(
        <Backdrop onBackdropClick={props.onBackdropClick} />,
        document.getElementById('backdrop-root')
      )}
      {ReactDOM.createPortal(
        <PostModal postId={postId} />,
        document.getElementById('overlay-root')
      )}
    </Fragment>
  );
};

export default PostDetail;
