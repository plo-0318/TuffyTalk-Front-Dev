import { useEffect, useState, memo, Fragment } from 'react';
import { useLocation } from 'react-router-dom';

import TopicItem from './TopicItem';
import LoadingSpinner from '../../ui/loading_spinner/LoadingSpinner';
import useHttp from '../../../hooks/use-http';
import { fetchData } from '../../../utils/sendHttp';
import {
  transformTopicText,
  transformParamTopicText,
} from '../../../utils/util';

import classes from './TopicList.module.css';
import topicImg from '../../../img/placeholder/topic-placeholder.png';

// status: pending, completed

const TopicList = (props) => {
  const location = useLocation();

  const { sendRequest, status, data: topics, error } = useHttp(fetchData);
  const [generalTopics, setGeneralTopics] = useState([]);
  const [stemTopics, setStemTopics] = useState([]);
  const [otherTopics, setOtherTopics] = useState([]);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    sendRequest({ path: '/topics', useProxy: false });
  }, [sendRequest]);

  const { onLoadTopic } = props;

  useEffect(() => {
    if (status === 'completed' && !error && topics) {
      const param = location.pathname.split('/');
      const paramTopic = param[2];
      const currentTopic = transformParamTopicText(paramTopic);

      topics.forEach((topic) => {
        if (topic.name === currentTopic) {
          onLoadTopic(topic._id);
        }

        if (!rendered) {
          if (topic.category === 'general') {
            setGeneralTopics((prevState) => [
              ...prevState,
              transformTopicText(topic.name),
            ]);
          } else if (topic.category === 'stem') {
            setStemTopics((prevState) => [
              ...prevState,
              transformTopicText(topic.name),
            ]);
          } else if (topic.category === 'others') {
            setOtherTopics((prevState) => [
              ...prevState,
              transformTopicText(topic.name),
            ]);
          }
        }
      });

      setRendered(true);
    }
  }, [topics, status, error, rendered, location, onLoadTopic]);

  return (
    <Fragment>
      {status === 'pending' && <LoadingSpinner />}

      {status === 'completed' && (
        <nav className={`${classes['main-container']} `}>
          <div className={classes['topic-container']}>
            <ul className={classes['topic_list-container']}>
              {generalTopics.map((topic) => (
                <TopicItem key={topic} topicImg={topicImg} topicName={topic} />
              ))}
            </ul>
            <hr />
          </div>

          <div className={classes['topic-container']}>
            <p className={classes['topic_category-text']}>STEM</p>
            <ul className={classes['topic_list-container']}>
              {stemTopics.map((topic) => (
                <TopicItem key={topic} topicImg={topicImg} topicName={topic} />
              ))}
            </ul>
            <hr />
          </div>

          <div className={classes['topic-container']}>
            <p className={classes['topic_category-text']}>Others</p>
            <ul className={classes['topic_list-container']}>
              {otherTopics.map((topic) => (
                <TopicItem key={topic} topicImg={topicImg} topicName={topic} />
              ))}
            </ul>
            <hr />
          </div>
        </nav>
      )}
    </Fragment>
  );
};

export default memo(TopicList);
