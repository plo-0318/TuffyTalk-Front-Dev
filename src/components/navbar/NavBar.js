import { UilSearch } from '@iconscout/react-unicons';
import { UilSetting } from '@iconscout/react-unicons';
import { useNavigate, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

import classes from './NavBar.module.css';
import logo from '../../img/logos/twitter_header_photo_1.png';

import userImg from '../../img/placeholder/user-placeholder.png';

const NavBar = () => {
  const navigate = useNavigate();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);

  const username = 'Cece';

  const authLinks = (
    <ul className={classes['nav_links-container']}>
      <li>
        <NavLink to='/signin' className={classes['nav_link']}>
          Sign in
        </NavLink>
      </li>
      <li>
        <NavLink
          to='/signup'
          className={`${classes['nav_link']} ${classes['nav_link__signup']}`}
        >
          Sign up
        </NavLink>
      </li>
      <li>
        <div className={classes['icon-container_setting']}>
          <UilSetting className={classes['icon_setting']} />
        </div>
      </li>
    </ul>
  );

  const userLinks = (
    <div className={classes['user_link-container']}>
      <img src={userImg} alt='user' />
      <NavLink className={classes['user_link']}>{username}</NavLink>
      <div className={classes['icon-container_setting']}>
        <UilSetting className={classes['icon_setting']} />
      </div>
    </div>
  );

  return (
    <nav className={classes['nav-container']}>
      {/* <div className={classes['logo-input-container']}>
        <div
          className={classes['logo-container']}
          onClick={() => {
            navigate('/', { replace: false });
          }}
        >
          <img src={logo} alt='logo of the website.' />
        </div>
        <div className={classes['search_bar-container']}>
          <input
            type='text'
            placeholder='Are cats better than dogs?'
            className={classes['search_bar-input']}
          />
          <div className={classes['icon-container_sticky']}>
            <UilSearch className={classes['icon_search']} />
          </div>
        </div>
      </div> */}
      <div
        className={classes['logo-container']}
        onClick={() => {
          navigate('/', { replace: false });
        }}
      >
        <img src={logo} alt='logo of the website.' />
      </div>
      <div className={classes['search_bar-container']}>
        <input
          type='text'
          placeholder='Are cats better than dogs?'
          className={classes['search_bar-input']}
        />
        <div className={classes['icon-container_sticky']}>
          <UilSearch className={classes['icon_search']} />
        </div>
      </div>
      {true && authLinks}
      {false && userLinks}
    </nav>
  );
};

export default NavBar;
