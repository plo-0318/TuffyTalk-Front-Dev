import { useEffect, useState, memo } from 'react';
import { Outlet } from 'react-router-dom';

import MainHeader from './main_page_header/MainHeader';
import CreatePost from './create_post/CreatePost';
import Posts from './posts/Posts';
import TopicList from './topic_list/TopicList';
import { UilBars } from '@iconscout/react-unicons';

import useHttp from '../../hooks/use-http';
import { sendHttp } from '../../utils/sendHttp';
import LoadingSpinner from '../ui/loading_spinner/LoadingSpinner';

import classes from './MainPage.module.css';

const MainPage = (props) => {
  const [topic, setTopic] = useState(null);

  const {
    sendRequest,
    status: postStatus,
    data: postData,
    error,
  } = useHttp(sendHttp);

  useEffect(() => {
    if (topic !== null) {
      sendRequest({ path: `/posts?topic=${topic._id}` });
    }
  }, [topic, sendRequest]);

  return (
    <main className={classes['main_page-container']}>
      <TopicList onLoadTopic={setTopic} />
      <div className={classes['main_page__content-container']}>
        <MainHeader topic={topic} />
        <CreatePost />
        {topic ? <Posts topic={topic} /> : <LoadingSpinner />}
      </div>
      <Outlet />
    </main>
  );
};

export default memo(MainPage);
