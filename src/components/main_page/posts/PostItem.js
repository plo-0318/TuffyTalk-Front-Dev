import { useEffect, memo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { API_URL, PROXY_API_URL, USE_PROXY } from '../../../utils/config';
import { currentPostActions } from '../../../store/currentPost';
import { mainPageScrollActions } from '../../../store/mainPageScroll';
import {
  UilThumbsUp,
  UilCommentDots,
  UilBookmark,
} from '@iconscout/react-unicons';
import { getUserImg } from '../../../utils/util';

import classes from './PostItem.module.css';
import placeholderImg from '../../../img/placeholder/topic-placeholder.png';

const PostItem = (props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { post: propsPost } = props;

  // TODO: CHANGE ALL POST TO USE numComments INSTEAD OF comments.length
  const [postData, setPostData] = useState({
    ...props.post,
    likes: props.post.numLikes,
    numComments: props.post.comments
      ? props.post.comments.length
      : props.post.numComments,
    createdAt: new Date(props.post.createdAt).toLocaleDateString(),
  });
  const [postImg, setPostImg] = useState(placeholderImg);

  const {
    postData: postStateData,
    id: postStateId,
    shouldUpdate,
  } = useSelector((state) => state.currentPost);

  const dispatch = useDispatch();

  // If there are images in the post, set the image cover for this post
  useEffect(() => {
    const loadImg = async () => {
      if (propsPost.images.length <= 0) {
        return;
      }

      const re = /<img[^>]+src="([^">]+)/g;
      let img;
      const images = [];
      while ((img = re.exec(propsPost.content))) {
        images.push(img[1]);
      }

      if (images.length > 0) {
        const url = USE_PROXY ? PROXY_API_URL : API_URL;

        const split = images[0].split('/');
        const id = split[split.length - 1];

        const res = await fetch(`${url}/images/${id}`);
        if (!res.ok) {
          return;
        }

        const data = await res.json();

        const blob = new Blob([Int8Array.from(data.data.data)], {
          type: data.type,
        });

        setPostImg(window.URL.createObjectURL(blob));
      }
    };

    loadImg();
  }, [propsPost]);

  // If the post data has changed update this post item
  useEffect(() => {
    if (postStateId === postData._id && shouldUpdate) {
      setPostData((prevState) => {
        return { ...prevState, ...postStateData };
      });

      // Reset the current post state after updating this post item
      dispatch(currentPostActions.resetState());
    }
  }, [postStateData, postStateId, shouldUpdate, postData, dispatch]);

  const hasImage = postData.images.length > 0;
  const titleContentClasses = `${classes['title_content-container']} ${
    hasImage ? '' : classes['title_content-container__no_img']
  }`;

  // const postImg = hasImage
  //   ? `${RESOURCE_URL}/img/users/${postData.author._id}/posts/${postData._id}/${postData.images[0]}`
  //   : null;

  const postClickHandler = () => {
    // dispatch(mainPageScrollActions.setDisableScroll(true));
    dispatch(mainPageScrollActions.saveScrollPosition());
    navigate(`${location.pathname}/post/${postData._id}`);
  };

  const userImg = getUserImg(postData.author);

  const pRegex = /(<p>).+?(>)/s;
  const liRegex = /(<li>).+?(>)/s;
  const htmlElementRegex = /(&).+?(;)/s;

  const p = postData.content.match(pRegex);
  const li = postData.content.match(liRegex);

  let content = '';

  if (p) {
    content = p[0];

    // <p>content</p> --> remove the p tags
    content = content.slice(3, -4);
  } else if (li) {
    content = li[0];

    // <li></li> --> remove the li tags
    content = content.slice(4, -5);
  }

  const result = content.match(htmlElementRegex);

  if (result && result[0]) {
    content = content.replace(`${result[0]}`, '');
  }

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
          <div className={classes['title_content__text-container']}>
            <p className={classes['title-text']}>{postData.title}</p>
            <p className={classes['content-text']}>{content}</p>
          </div>
          <div className={classes['footer-container']}>
            <UilThumbsUp className={classes['footer-icon']} />
            <p>{postData.likes}</p>
            <UilCommentDots className={classes['footer-icon']} />
            <p>{postData.numComments}</p>
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
