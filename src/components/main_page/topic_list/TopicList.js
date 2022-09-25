import topicImg from '../../../img/placeholder/topic-placeholder.png';

import classes from './TopicList.module.css';
import commonClasses from '../../../utils/common.module.css';

const GENERAL = ['Gneral'];
const STEM = ['CS', 'Math', 'Engineering', 'Physics'];
const OTHERS = ['Psychology', 'Accounting', 'Art'];

const TopicList = () => {
  return (
    <nav className={`${classes['main-container']} `}>
      <div className={classes['topic-container']}>
        <ul className={classes['topic_list-container']}>
          {GENERAL.map((topic) => (
            <li key={topic}>
              <img
                src={topicImg}
                alt='topic'
                className={commonClasses['disable_select']}
              />
              <button
                className={`${classes['topic-btn']} ${commonClasses['disable_select']}`}
              >
                {topic}
              </button>
            </li>
          ))}
        </ul>
        <hr />
      </div>

      <div className={classes['topic-container']}>
        <p className={classes['topic_category-text']}>STEM</p>
        <ul className={classes['topic_list-container']}>
          {STEM.map((topic) => (
            <li key={topic}>
              <img
                src={topicImg}
                alt='topic'
                className={commonClasses['disable_select']}
              />
              <button
                className={`${classes['topic-btn']} ${commonClasses['disable_select']}`}
              >
                {topic}
              </button>
            </li>
          ))}
        </ul>
        <hr />
      </div>

      <div className={classes['topic-container']}>
        <p className={classes['topic_category-text']}>Others</p>
        <ul className={classes['topic_list-container']}>
          {OTHERS.map((topic) => (
            <li key={topic}>
              <img
                src={topicImg}
                alt='topic'
                className={commonClasses['disable_select']}
              />
              <button
                className={`${classes['topic-btn']} ${commonClasses['disable_select']}`}
              >
                {topic}
              </button>
            </li>
          ))}
        </ul>
        <hr />
      </div>
    </nav>
  );
};

export default TopicList;
