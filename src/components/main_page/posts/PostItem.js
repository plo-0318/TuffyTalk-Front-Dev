import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { mainPageScrollActions } from '../../../store/mainPageScroll';

import {
  UilThumbsUp,
  UilCommentDots,
  UilBookmark,
} from '@iconscout/react-unicons';

import classes from './PostItem.module.css';
import userImg from '../../../img/placeholder/user-placeholder.png';
import postImg from '../../../img/placeholder/topic-placeholder.png';

//     username: 'cece',
//     profilePic: userImg,
//     title: 'This is a post title',
//     content: '',
//     createdAt: '2022-9-20',
//     likes: 78,
//     comments: ['123', '456', '789'],
//     img: null,

const PostItem = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const post = {
    username: props.post.author.username,
    profilePic: userImg,
    title: props.post.title,
    content: props.post.content,
    createdAt: new Date(props.post.createdAt).toLocaleDateString(),
    likes: props.post.likes,
    comments: props.post.comments.length,
    postImg,
    id: props.post._id,
  };

  const titleContentClasses = `${classes['title_content-container']} ${
    props.postImg ? '' : classes['title_content-container__no_img']
  }`;

  const postClickHandler = () => {
    dispatch(mainPageScrollActions.setDisableScroll(true));
    navigate(`${location.pathname}/post/${post.id}`);
  };

  return (
    <div className={classes['post-container']} onClick={postClickHandler}>
      <div className={classes['header-container']}>
        <div className={classes['header__picture_name-container']}>
          <img src={post.profilePic} alt='user' />
          <p className={classes['username']}>{post.username}</p>
        </div>
        <p>{post.createdAt}</p>
      </div>

      <div className={classes['main_content-container']}>
        <div className={titleContentClasses}>
          <p className={classes['title-text']}>{post.title}</p>
          <p className={classes['content-text']}>{post.content}</p>
          <div className={classes['footer-container']}>
            <UilThumbsUp className={classes['footer-icon']} />
            <p>{post.likes.length}</p>
            <UilCommentDots className={classes['footer-icon']} />
            <p>{post.comments}</p>
            {props.bookmark && (
              <UilBookmark className={classes['footer-icon']} />
            )}
          </div>
        </div>
        {post.postImg && (
          <div className={classes['post_img-container']}>
            <img src={post.postImg} alt='post' />
          </div>
        )}
      </div>

      <hr className={classes['post_item__divider']} />
    </div>
  );
};

export default PostItem;
