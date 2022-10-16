import { useEffect, useState, memo, Fragment } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { UilTriangle } from '@iconscout/react-unicons';

import useDropDown from '../../../hooks/use-dropdown';
import TopicItem from './TopicItem';
import LoadingSpinner from '../../ui/loading_spinner/LoadingSpinner';
import useHttp from '../../../hooks/use-http';
import { sendHttp } from '../../../utils/sendHttp';
import { camelToSpace, toCamel } from '../../../utils/util';
import { RESOURCE_URL } from '../../../utils/config';

import classes from './TopicList.module.css';
import topicImage from '../../../img/placeholder/topic-placeholder.png';

// status: pending, completed

const TopicList = (props) => {
  const location = useLocation();

  const { sendRequest, status, data: topics, error } = useHttp(sendHttp);
  const [generalTopics, setGeneralTopics] = useState([]);
  const [stemTopics, setStemTopics] = useState([]);
  const [otherTopics, setOtherTopics] = useState([]);
  const [rendered, setRendered] = useState(false);

  const generalDropDown = useDropDown();
  const stemDropDown = useDropDown();
  const othersDropDown = useDropDown();

  const [matches, setMatches] = useState(
    window.matchMedia('(min-width: 1050px)').matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1050px)');
    const listener = (e) => setMatches(e.matches);

    mediaQuery.addEventListener('change', listener);

    return () => {
      mediaQuery.removeEventListener('change', listener);
    };
  }, []);

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
          {matches && (
            <Fragment>
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
            </Fragment>
          )}

          {!matches && (
            <Fragment>
              <div
                className={classes['topic-container__bar']}
                onMouseEnter={generalDropDown.itemOnMouseEnter}
                onMouseLeave={generalDropDown.itemOnMouseLeave}
              >
                <p>Generals</p>
                <UilTriangle className={classes['topic_bar-icon']} />
                <div
                  className={`${classes['topic_bar__dropdown-container']} ${
                    generalDropDown.dropDownOpen
                      ? ''
                      : classes['topic_bar__dropdown-container__close']
                  }`}
                >
                  <ul
                    className={classes['topic_bar__dropdown__items-container']}
                  >
                    {generalTopics.map((topic) => {
                      const topicName = camelToSpace(topic.name);
                      const url = topicName.toLowerCase().split(' ').join('-');

                      return (
                        <li key={topicName}>
                          <NavLink
                            className={classes['dropdown_item']}
                            to={`/topic/${url}`}
                          >
                            <img
                              className={classes['dropdown_topic-img']}
                              src={`${RESOURCE_URL}/img/topics/${topic.icon}`}
                              alt='topic'
                            />
                            {topicName}
                          </NavLink>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              <div
                className={classes['topic-container__bar']}
                onMouseEnter={stemDropDown.itemOnMouseEnter}
                onMouseLeave={stemDropDown.itemOnMouseLeave}
              >
                <p>STEM</p>{' '}
                <UilTriangle className={classes['topic_bar-icon']} />
                <div
                  className={`${classes['topic_bar__dropdown-container']} ${
                    stemDropDown.dropDownOpen
                      ? ''
                      : classes['topic_bar__dropdown-container__close']
                  }`}
                >
                  <ul
                    className={classes['topic_bar__dropdown__items-container']}
                  >
                    {stemTopics.map((topic) => {
                      const topicName = camelToSpace(topic.name);
                      const url = topicName.toLowerCase().split(' ').join('-');

                      return (
                        <li key={topicName}>
                          <NavLink
                            className={classes['dropdown_item']}
                            to={`/topic/${url}`}
                          >
                            <img
                              className={classes['dropdown_topic-img']}
                              src={`${RESOURCE_URL}/img/topics/${topic.icon}`}
                              alt='topic'
                            />
                            {topicName}
                          </NavLink>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              <div
                className={classes['topic-container__bar']}
                onMouseEnter={othersDropDown.itemOnMouseEnter}
                onMouseLeave={othersDropDown.itemOnMouseLeave}
              >
                <p>Others</p>{' '}
                <UilTriangle className={classes['topic_bar-icon']} />
                <div
                  className={`${classes['topic_bar__dropdown-container']} ${
                    othersDropDown.dropDownOpen
                      ? ''
                      : classes['topic_bar__dropdown-container__close']
                  }`}
                >
                  <ul
                    className={classes['topic_bar__dropdown__items-container']}
                  >
                    {otherTopics.map((topic) => {
                      const topicName = camelToSpace(topic.name);
                      const url = topicName.toLowerCase().split(' ').join('-');

                      return (
                        <li key={topicName}>
                          <NavLink
                            className={classes['dropdown_item']}
                            to={`/topic/${url}`}
                          >
                            <img
                              className={classes['dropdown_topic-img']}
                              src={`${RESOURCE_URL}/img/topics/${topic.icon}`}
                              alt='topic'
                            />
                            {topicName}
                          </NavLink>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </Fragment>
          )}
        </nav>
      )}
    </Fragment>
  );
};

export default memo(TopicList);
