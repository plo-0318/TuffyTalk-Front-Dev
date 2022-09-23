import { UilSearch } from '@iconscout/react-unicons';
import { UilSetting } from '@iconscout/react-unicons';
import { useNavigate, NavLink } from 'react-router-dom';

import classes from './NavBar.module.css';
import logo from '../../img/logos/twitter_header_photo_1.png';

const NavBar = () => {
  const navigate = useNavigate();

  return (
    <nav className={classes['nav-container']}>
      <div className={classes['logo-input-container']}>
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
      </div>
      <ul className={classes['nav_links-container']}>
        <li>
          <NavLink to='/login' className={classes['nav_link']}>
            Log in
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
    </nav>
  );
};

export default NavBar;
