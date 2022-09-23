import { UilThumbsUp } from '@iconscout/react-unicons';
import { UilCommentDots } from '@iconscout/react-unicons';

import classes from './PostItem.module.css';

//     username: 'cece',
//     gender: 'femail',
//     profilePic: userImg,
//     title: 'This is a post title',
//     content: '',
//     createdAt: '2022-9-20',
//     likes: 78,
//     comments: ['123', '456', '789'],
//     img: null,

const PostItem = (props) => {
  const {
    username,
    gender,
    profilePic,
    title,
    content,
    createdAt,
    likes,
    comments,
    postImg,
  } = props.post;

  const titleContentClasses = `${classes['title_content-container']} ${
    postImg ? '' : classes['title_content-container__no_img']
  }`;

  return (
    <div className={classes['post-container']}>
      <div className={classes['header-container']}>
        <div className={classes['header__picture_name-container']}>
          <img src={profilePic} alt='user' />
          <p className={classes['username']}>{username}</p>
        </div>
        <p>{createdAt}</p>
      </div>
      <div className={classes['main_content-container']}>
        <div className={titleContentClasses}>
          <p className={classes['title-text']}>{title}</p>
          <p className={classes['content-text']}>{content}</p>
          <div className={classes['footer-container']}>
            <UilThumbsUp className={classes['footer-icon']} />
            <p>{likes}</p>
            <UilCommentDots className={classes['footer-icon']} />
            <p>{comments.length}</p>
          </div>
        </div>
        {postImg && (
          <div className={classes['post_img-container']}>
            <img src={postImg} alt='post' />
          </div>
        )}
      </div>
      <hr />
    </div>
  );
};

export default PostItem;
