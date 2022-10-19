import { Outlet, useLocation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Fragment, useEffect, useState } from 'react';

import PostItem from '../main_page/posts/PostItem';
import TopicList from '../main_page/topic_list/TopicList';
import useHttp from '../../hooks/use-http';
import { sendHttp } from '../../utils/sendHttp';
import LoadingSpinner from '../ui/loading_spinner/LoadingSpinner';
import { searchActions } from '../../store/search';

import classes from './SearchResult.module.css';
import commonClasses from '../../utils/common.module.css';

const SearchResult = () => {
  const user = useSelector((state) => state.auth.user);
  const counter = useSelector((state) => state.search.counter);
  const searchTerm = useParams().searchTerm;

  const [, setCounter] = useState(counter);

  const location = useLocation();

  const savedScrollPos = useSelector(
    (state) => state.mainPageScroll.scrollPosition
  );

  const {
    sendRequest: fetchPosts,
    status: postStatus,
    error: postError,
    data: postData,
  } = useHttp(sendHttp);

  useEffect(() => {
    if (searchTerm !== '') {
      fetchPosts({
        path: `/posts/search?term=${searchTerm}`,
      });
    }

    // tick to refresh the page
    setCounter(counter);
  }, [searchTerm, fetchPosts, counter]);

  useEffect(() => {
    if (postStatus === 'completed' && !postError) {
    }
  }, [postStatus, postError, postData]);

  useEffect(() => {
    if (location.state && location.state.restoreScroll) {
      window.scrollTo(0, savedScrollPos);
    }
  }, [location, savedScrollPos]);

  return (
    <Fragment>
      <div className={classes['search_result_page-container']}>
        <TopicList />
        <div
          className={`${commonClasses['main-container']} ${classes['search_result-container']}`}
        >
          <div className={classes['search_result__header-container']}>
            <p>Results for: </p>
            <span>{searchTerm}</span>
          </div>
          {postStatus === 'completed' ? (
            postData.map((post) => {
              return (
                <PostItem
                  key={post._id}
                  post={post}
                  bookmark={user ? user.bookmarks.includes(post._id) : false}
                />
              );
            })
          ) : (
            <LoadingSpinner />
          )}
        </div>
      </div>
      <Outlet />
    </Fragment>
  );
};

export default SearchResult;
