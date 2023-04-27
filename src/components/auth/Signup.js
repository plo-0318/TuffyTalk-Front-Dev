import { NavLink } from 'react-router-dom';

import SignupForm from './form/SignupForm';
import { RESOURCE_URL } from '../../utils/config';

import classes from './Signup.module.css';

const Signup = () => {
  return (
    <div className={`${classes['signup-container']}`}>
      <div className={classes['description-container']}>
        <p className={classes['description_title-text']}>
          A place to connect, share, and grow
        </p>
        <p className={classes['description_content-text']}>
          Our online discussion board fosters a sense of community and
          encourages thoughtful discussions, debates, and collaboration between
          students
        </p>
        <div className={classes['general_link-container']}>
          <img src={`${RESOURCE_URL}/img/topics/general.webp`} alt='topic' />
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
