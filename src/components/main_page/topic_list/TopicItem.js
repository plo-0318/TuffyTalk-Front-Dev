import { NavLink } from 'react-router-dom';

import classes from './TopicList.module.css';
import commonClasses from '../../../utils/common.module.css';

const TopicItem = (props) => {
  const url = props.topicName.toLowerCase().split(' ').join('-');

  return (
    <li key={props.topic}>
      <NavLink
        className={`${classes['topic_link']} ${commonClasses['disable_select']}`}
        to={`/topic/${url}`}
      >
        <img
          src={props.topicImg}
          alt='topic'
          className={commonClasses['disable_select']}
        />
        {props.topicName}
      </NavLink>
    </li>
  );
};

export default TopicItem;
