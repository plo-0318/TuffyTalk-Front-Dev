import { NavLink } from 'react-router-dom';

import topicImg from '../../img/placeholder/topic-placeholder.png';
import SignupForm from './form/SignupForm';

import classes from './Signup.module.css';

const Signup = () => {
  return (
    <div className={`${classes['signup-container']}`}>
      <div className={classes['description-container']}>
        <p className={classes['description_title-text']}>
          The best way to talk with your schoolmates
        </p>
        <p className={classes['description_content-text']}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat.
        </p>
        <div className={classes['general_link-container']}>
          <img src={topicImg} alt='topic' />
          <NavLink to='/' className={classes['nav_link']}>
            Discussion Boards
          </NavLink>
        </div>
      </div>
      <SignupForm />
    </div>
  );
};

export default Signup;
