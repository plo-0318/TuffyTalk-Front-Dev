import { UilSearch, UilSetting } from '@iconscout/react-unicons';
import { useNavigate, NavLink } from 'react-router-dom';
import { Fragment, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { authActions } from '../../store/auth';

import useHttp from '../../hooks/use-http';
import { logout } from '../../utils/sendHttp';

import classes from './NavBar.module.css';
import logo from '../../img/logos/twitter_header_photo_1.png';

import userImg from '../../img/placeholder/user-placeholder.png';

const SettingIcon = (props) => {
  const [settingOpen, setSettingOpen] = useState(false);
  const [mouseInPopup, setMouseInPopup] = useState(false);
  const [mouseInIconContainer, setMouseInIconContainer] = useState(false);
  const [mouseOnSettingIcon, setMouseOnSettingIcon] = useState(false);

  useEffect(() => {
    if (settingOpen) {
      if (!mouseInPopup && !mouseOnSettingIcon && !mouseInIconContainer) {
        setSettingOpen(false);
      }
    }
  }, [settingOpen, mouseInPopup, mouseOnSettingIcon, mouseInIconContainer]);

  const iconContainerMouseHoverHandler = () => {
    setMouseInIconContainer(true);
  };

  const iconContainerMouseLeaveHandler = () => {
    setMouseInIconContainer(false);
  };

  const settingIconHoverHandler = () => {
    setMouseOnSettingIcon(true);

    if (!settingOpen) {
      setSettingOpen(true);
    }
  };

  const settingIconMoseLeaveHandler = () => {
    setMouseOnSettingIcon(false);
  };

  const popupHoverHandler = () => {
    setMouseInPopup(true);
  };

  const popupMoseLeaveHandler = () => {
    setMouseInPopup(false);
  };

  return (
    <div
      className={classes['icon-container_setting']}
      onMouseEnter={iconContainerMouseHoverHandler}
      onMouseLeave={iconContainerMouseLeaveHandler}
    >
      <div
        className={classes['icon-wrapper']}
        onMouseEnter={settingIconHoverHandler}
        onMouseLeave={settingIconMoseLeaveHandler}
      >
        <UilSetting className={classes['icon_setting']} />
      </div>
      {settingOpen && (
        <div
          className={`${classes['popup-container']}`}
          onMouseEnter={popupHoverHandler}
          onMouseLeave={popupMoseLeaveHandler}
        >
          <ul className={classes['popup_btn-container']}>
            {props.isLoggedIn && (
              <Fragment>
                <li>
                  <button className={classes['popup-btn']}>Account</button>
                </li>
                <li>
                  <button
                    className={classes['popup-btn']}
                    onClick={props.onLogout}
                  >
                    Sign Out
                  </button>
                </li>
              </Fragment>
            )}
            <li>
              <button className={classes['popup-btn']}>Help</button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

const AuthLinks = (props) => (
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
    <li className={classes['setting-container']}>
      <SettingIcon isLoggedIn={props.isLoggedIn} />
    </li>
  </ul>
);

const UserLinks = (props) => {
  return (
    <ul className={classes['nav_links-container']}>
      <li className={classes['user_img-container']}>
        <img src={userImg} alt='user' />
      </li>
      <li>
        <NavLink className={classes['user_link']} to='/me/profile'>
          {props.user.username}
        </NavLink>
      </li>
      <li className={classes['setting-container']}>
        <SettingIcon onLogout={props.onLogout} isLoggedIn={props.isLoggedIn} />
      </li>
    </ul>
  );
};

const NavBar = () => {
  const navigate = useNavigate();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const {
    sendRequest: _logout,
    status: logoutStatus,
    error: logoutError,
  } = useHttp(logout);

  const logoutHandler = () => {
    _logout(true);
    dispatch(authActions.setUser(null));
    dispatch(authActions.logout());
    navigate('/', { replace: true });
  };

  return (
    <nav className={classes['nav-container']}>
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
      {isAuthenticated ? (
        <UserLinks
          user={user}
          onLogout={logoutHandler}
          isLoggedIn={isAuthenticated}
        />
      ) : (
        <AuthLinks isLoggedIn={isAuthenticated} />
      )}
    </nav>
  );
};

export default NavBar;
