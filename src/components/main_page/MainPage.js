import { useEffect, useState, memo } from 'react';
import { Outlet } from 'react-router-dom';

import MainHeader from './main_page_header/MainHeader';
import CreatePost from './create_post/CreatePost';
import Posts from './posts/Posts';
import TopicList from './topic_list/TopicList';

import useHttp from '../../hooks/use-http';
import { fetchData } from '../../utils/sendHttp';
import LoadingSpinner from '../ui/loading_spinner/LoadingSpinner';

import classes from './MainPage.module.css';

const MainPage = (props) => {
  const [topicId, setTopicId] = useState(null);
  const { sendRequest, status, data: postData, error } = useHttp(fetchData);

  useEffect(() => {
    if (topicId !== null) {
      sendRequest({ path: `/posts?topic=${topicId}`, useProxy: false });
    }
  }, [topicId, sendRequest]);

  return (
    <main className={classes['main_page-container']}>
      <TopicList onLoadTopic={setTopicId} />
      <div className={classes['main_page__content-container']}>
        <MainHeader />
        <CreatePost />
        {status === 'completed' ? (
          <Posts postData={postData} />
        ) : (
          <LoadingSpinner />
        )}
      </div>
      <Outlet />
    </main>
  );
};

export default memo(MainPage);
