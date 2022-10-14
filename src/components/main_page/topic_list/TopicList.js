import { useEffect, useState, memo, Fragment } from 'react';
import { useLocation } from 'react-router-dom';

import TopicItem from './TopicItem';
import LoadingSpinner from '../../ui/loading_spinner/LoadingSpinner';
import useHttp from '../../../hooks/use-http';
import { sendHttp } from '../../../utils/sendHttp';
import { camelToSpace, toCamel } from '../../../utils/util';
import { RESOURCE_URL } from '../../../utils/config';

import classes from './TopicList.module.css';

// status: pending, completed

const TopicList = (props) => {
  const location = useLocation();

  const { sendRequest, status, data: topics, error } = useHttp(sendHttp);
  const [generalTopics, setGeneralTopics] = useState([]);
  const [stemTopics, setStemTopics] = useState([]);
  const [otherTopics, setOtherTopics] = useState([]);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    sendRequest({ path: '/topics?sort=name', useProxy: false });
  }, [sendRequest]);

  const { onLoadTopic } = props;

  useEffect(() => {
    if (status === 'completed' && !error && topics) {
      let param;
      let paramTopic;
      let currentTopic;

      if (location.pathname.startsWith('/topic')) {
        param = location.pathname.split('/');
        paramTopic = param[2];
        currentTopic = toCamel(paramTopic, '-');
      }

      const general = [];
      const stem = [];
      const others = [];

      topics.forEach((topic) => {
        if (topic.name === currentTopic) {
          onLoadTopic(topic);
        }

        if (!rendered) {
          if (topic.category === 'general') {
            general.push(topic);
          } else if (topic.category === 'stem') {
            stem.push(topic);
          } else if (topic.category === 'others') {
            others.push(topic);
          }
        }
      });

      stem.sort((a, b) => a.name < b.name);
      others.sort((a, b) => a.name < b.name);

      if (!rendered) {
        setGeneralTopics(general);
        setStemTopics(stem);
        setOtherTopics(others);
        setRendered(true);
      }
    }
  }, [topics, status, error, rendered, location, onLoadTopic]);

  return (
    <Fragment>
      {(status === 'pending' || error) && <LoadingSpinner />}

      {status === 'completed' && !error && (
        <nav className={`${classes['main-container']} `}>
          <div className={classes['topic-container']}>
            <ul className={classes['topic_list-container']}>
              {generalTopics.map((topic) => {
                const topicName = camelToSpace(topic.name);

                return (
                  <TopicItem
                    key={topicName}
                    topicImg={`${RESOURCE_URL}/img/topics/${topic.icon}`}
                    topicName={topicName}
                  />
                );
              })}
            </ul>
            <hr />
          </div>

          <div className={classes['topic-container']}>
            <p className={classes['topic_category-text']}>STEM</p>
            <ul className={classes['topic_list-container']}>
              {stemTopics.map((topic) => {
                const topicName = camelToSpace(topic.name);

                return (
                  <TopicItem
                    key={topicName}
                    topicImg={`${RESOURCE_URL}/img/topics/${topic.icon}`}
                    topicName={topicName}
                  />
                );
              })}
            </ul>
            <hr />
          </div>

          <div className={classes['topic-container']}>
            <p className={classes['topic_category-text']}>Others</p>
            <ul className={classes['topic_list-container']}>
              {otherTopics.map((topic) => {
                const topicName = camelToSpace(topic.name);

                return (
                  <TopicItem
                    key={topicName}
                    topicImg={`${RESOURCE_URL}/img/topics/${topic.icon}`}
                    topicName={topicName}
                  />
                );
              })}
            </ul>
            <hr />
          </div>
        </nav>
      )}
    </Fragment>
  );
};

export default memo(TopicList);
