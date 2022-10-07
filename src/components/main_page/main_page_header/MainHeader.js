import { useState, memo } from 'react';
import { useLocation } from 'react-router-dom';

import { camelToSpace, toCamel } from '../../../utils/util';
import { RESOURCE_URL } from '../../../utils/config';

import classes from './MainHeader.module.css';
import commonClasses from '../../../utils/common.module.css';
import topicImage from '../../../img/placeholder/topic-placeholder.png';

const MainHeader = (props) => {
  const location = useLocation();
  const paramTopic = location.pathname.split('/')[2];
  const topic = camelToSpace(toCamel(paramTopic, '-'));

  const [selectedTab, setSelectedTab] = useState('hot');

  const hotBtnHandler = (e) => {
    if (selectedTab !== 'hot') {
      setSelectedTab('hot');
    }
  };

  const newBtnHandler = (e) => {
    if (selectedTab !== 'new') {
      setSelectedTab('new');
    }
  };

  return (
    <div
      className={`${commonClasses['main-container']} ${commonClasses['center-margin_bottom']} ${classes['header__main-container']}`}
    >
      <header className={classes['header-container']}>
        <div className={classes['header__title-container']}>
          <div className={classes['topic_img-container']}>
            <img
              src={
                props.topic
                  ? `${RESOURCE_URL}/img/topics/${props.topic.icon}`
                  : topicImage
              }
              alt='topic'
            />
          </div>
          <p>{topic}</p>
        </div>
        <ul className={classes['header__tabs-container']}>
          <li>
            <div className={classes['header__tabs__buttons-container']}>
              <button
                className={`${classes['header__tabs-btn']} ${
                  selectedTab === 'hot'
                    ? classes['header__tabs-btn__active']
                    : ''
                } `}
                onClick={hotBtnHandler}
              >
                Hot
              </button>
              <button
                className={`${classes['header__tabs-btn']} ${
                  selectedTab === 'new'
                    ? classes['header__tabs-btn__active']
                    : ''
                }`}
                onClick={newBtnHandler}
              >
                New
              </button>
            </div>
          </li>
        </ul>
      </header>
    </div>
  );
};

export default memo(MainHeader);
