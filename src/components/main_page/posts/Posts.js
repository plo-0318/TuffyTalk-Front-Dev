import { useState, useEffect, memo, Fragment, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LoadingSpinner from '../../ui/loading_spinner/LoadingSpinner';
import { useSearchParams } from 'react-router-dom';

import PostItem from './PostItem';
import useHttp from '../../../hooks/use-http';
import { sendHttp } from '../../../utils/sendHttp';
import { POST_LIMIT } from '../../../utils/config';

import commonClasses from '../../../utils/common.module.css';
import classes from './Posts.module.css';
import { postListActions } from '../../../store/postList';

const PageButtons = (props) => {
  const { numPages, currentPage, onPageChange } = props;

  const insertButton = (count, currentIndex, direction) => {
    let index = Number.parseInt(currentIndex);
    const jsx = [];

    for (let i = 0; i < count; i++) {
      if (direction === 'right') {
        jsx.push(
          <button
            key={index + 1}
            className={`${classes['page_btn']}`}
            onClick={onPageChange.bind(null, index + 1)}
          >
            {index + 1}
          </button>
        );

        index++;
      } else {
        jsx.unshift(
          <button
            key={index - 1}
            className={`${classes['page_btn']}`}
            onClick={onPageChange.bind(null, index - 1)}
          >
            {index - 1}
          </button>
        );
        index--;
      }
    }

    return jsx;
  };

  let jsx = [];

  // Adding the left side buttons
  if (currentPage > 1 && currentPage <= 3) {
    jsx = [...insertButton(currentPage - 1, 0, 'right')];
  } else if (currentPage > 3) {
    jsx.push(
      <button
        key={1}
        className={`${classes['page_btn']}`}
        onClick={onPageChange.bind(null, 1)}
      >
        1
      </button>
    );
    jsx.push(
      <p key={'left_ellipses'} className={classes['elipses']}>
        ...
      </p>
    );
    jsx = [...jsx, ...insertButton(2, currentPage, 'left')];
  }

  // Adding current button
  jsx.push(
    <button
      key={currentPage}
      className={`${classes['page_btn']} ${classes['page_btn__active']}`}
      onClick={onPageChange.bind(null, currentPage)}
    >
      {currentPage}
    </button>
  );

  // Adding the right side buttons
  if (currentPage + 2 >= numPages) {
    jsx = [
      ...jsx,
      ...insertButton(numPages - currentPage, currentPage, 'right'),
    ];
  } else {
    jsx = [...jsx, ...insertButton(2, currentPage, 'right')];
    jsx.push(
      <p key={'right_ellipses'} className={classes['elipses']}>
        ...
      </p>
    );
    jsx.push(
      <button
        key={numPages}
        className={`${classes['page_btn']}`}
        onClick={onPageChange.bind(null, numPages)}
      >
        {numPages}
      </button>
    );
  }

  return <div className={classes['page_btns-container']}>{jsx}</div>;
};

const PostsContent = memo((props) => {
  const { postData } = props;

  const user = useSelector((state) => state.auth.user);
  const userBookmarks = useSelector((state) => state.auth.bookmarks);

  const likedPosts = useSelector((state) => state.auth.likedPosts);

  // TODO: CHANGE THE BOOKMARK HANDLING
  const hasBookmark = useCallback(
    (id) => {
      if (!user) {
        return false;
      }

      if (user.bookmarks) {
        return user.bookmarks.includes(id);
      }

      return userBookmarks.includes(id);
    },
    [user, userBookmarks]
  );

  const contentNoPosts = (
    <div className={classes['no_content-container']}>
      <p>There are no posts for the this topic</p>
      <p>Be the first one to post 😎</p>
    </div>
  );

  const contentHavePosts = postData.map((post) => {
    return (
      <PostItem key={post._id} post={post} bookmark={hasBookmark(post._id)} />
    );
  });

  return postData.length > 0 ? contentHavePosts : contentNoPosts;
});

const Posts = (props) => {
  const { topic } = props;

  const dispatch = useDispatch();

  const counter = useSelector((state) => state.postList.counter);
  const sort = useSelector((state) => state.postList.sort);
  const currentPage = useSelector((state) => state.postList.currentPage);

  const [searchParams] = useSearchParams();

  if (searchParams.get('page')) {
    dispatch(postListActions.setCurrentPage(searchParams.get('page')));
  }

  const [, setCounter] = useState(counter);
  const [currentTopic, setCurrentTopic] = useState(topic._id);

  const postLimit = searchParams.get('limit') || POST_LIMIT;

  let numPages = Math.trunc(topic.posts.length / postLimit);
  if (topic.posts.length % postLimit !== 0) {
    numPages++;
  }
  if (postLimit === 1) {
    numPages = topic.posts.length;
  }

  const {
    sendRequest: fetchPosts,
    status: postStatus,
    data: postData,
    error: postError,
  } = useHttp(sendHttp);

  useEffect(() => {
    const sortBy = sort === 'new' ? 'sort=-createdAt,_id' : 'sort=numLikes,_id';

    fetchPosts({
      path: `/posts?topic=${topic._id}&page=${currentPage}&limit=${postLimit}&${sortBy}`,
    });

    // Resetting the page number when user switch topic
    if (currentTopic !== topic._id) {
      setCurrentTopic(topic._id);
      dispatch(postListActions.setCurrentPage(1));
    }

    setCounter(counter);
  }, [
    fetchPosts,
    topic,
    currentPage,
    currentTopic,
    counter,
    postLimit,
    sort,
    dispatch,
  ]);

  const changePageHandler = (page) => {
    dispatch(postListActions.setCurrentPage(page));
  };

  return (
    <article
      style={{ width: '100%' }}
      className={`${commonClasses['main-container']} ${commonClasses['center-margin_bottom']} ${classes['posts-container']}}`}
    >
      {postStatus === 'completed' ? (
        <Fragment>
          <PostsContent postData={postData} topic={topic} />
          <PageButtons
            numPages={numPages}
            currentPage={currentPage}
            onPageChange={changePageHandler}
          />
        </Fragment>
      ) : (
        <LoadingSpinner />
      )}
    </article>
  );
};

export default memo(Posts);
