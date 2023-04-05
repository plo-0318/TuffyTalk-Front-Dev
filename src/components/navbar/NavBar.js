import { UilSearch, UilBars } from '@iconscout/react-unicons';
import { useNavigate, NavLink } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { Fragment, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CSSTransition } from 'react-transition-group';

import useHttp from '../../hooks/use-http';
import { logout } from '../../utils/sendHttp';
import { authActions } from '../../store/auth';

import classes from './NavBar.module.css';
import logo from '../../img/logos/twitter_header_photo_1.png';

const Backdrop = (props) => {
  return (
    <CSSTransition
      in={props.show}
      mountOnEnter
      unmountOnExit
      timeout={400}
      classNames={{
        enter: '',
        enterActive: classes['backdrop-open'],
        exit: '',
        exitActive: classes['backdrop-close'],
        appear: '',
        appearActive: '',
      }}
    >
      <div
        className={classes['modal_backdrop']}
        onClick={props.closeModal}
      ></div>
    </CSSTransition>
  );
};

const MenuModal = (props) => {
  const navigate = useNavigate();

  const navigateBtnClickHandler = (path) => {
    props.closeModal();
    navigate(path);
  };

  const logoutClickHandler = () => {
    props.closeModal();
    props.onLogout();
  };

  return (
    <CSSTransition
      in={props.show}
      mountOnEnter
      unmountOnExit
      timeout={400}
      classNames={{
        enter: '',
        enterActive: classes['modal-open'],
        exit: '',
        exitActive: classes['modal-close'],
        appear: '',
        appearActive: '',
      }}
    >
      <div className={classes['menu_modal-container']}>
        <div className={classes['menu_modal__header-container']}>
          <p>Menu</p>
        </div>
        <ul className={classes['menu_modal__items-container']}>
          {props.isLoggedIn && (
            <Fragment>
              <li>
                <button
                  className={classes['menu_modal__item']}
                  onClick={navigateBtnClickHandler.bind(null, '/me/profile')}
                >
                  Account
                </button>
              </li>
              <li>
                <button
                  className={classes['menu_modal__item']}
                  onClick={logoutClickHandler}
                >
                  Logout
                </button>
              </li>
            </Fragment>
          )}

          {!props.isLoggedIn && (
            <Fragment>
              <li>
                <button
                  className={classes['menu_modal__item']}
                  onClick={navigateBtnClickHandler.bind(null, '/signup')}
                >
                  Sign Up
                </button>
              </li>
              <li>
                <button
                  className={classes['menu_modal__item']}
                  onClick={navigateBtnClickHandler.bind(null, '/signin')}
                >
                  Sign In
                </button>
              </li>
            </Fragment>
          )}

          <li>
            <button
              className={classes['menu_modal__item']}
              onClick={navigateBtnClickHandler.bind(null, '/')}
            >
              Help
            </button>
          </li>
        </ul>
      </div>
    </CSSTransition>
  );
};

const Menu = (props) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuClickHandler = () => {
    setMenuOpen(true);
  };

  const closeModal = () => {
    setMenuOpen(false);
  };

  return (
    <Fragment>
      {ReactDOM.createPortal(
        <Backdrop show={menuOpen} closeModal={closeModal} />,
        document.getElementById('backdrop-root')
      )}
      {ReactDOM.createPortal(
        <MenuModal
          closeModal={closeModal}
          show={menuOpen}
          isLoggedIn={props.isLoggedIn}
          onLogout={props.onLogout}
        />,
        document.getElementById('overlay-root')
      )}
      <div className={classes['menu_icon-container']}>
        <div className={classes['icon-wrapper']} onClick={menuClickHandler}>
          <UilBars className={classes['icon_setting']} />
        </div>
      </div>
    </Fragment>
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
      <Menu isLoggedIn={props.isLoggedIn} />
    </li>
  </ul>
);

const UserLinks = (props) => {
  const navigate = useNavigate();

  const userImage = props.user.profilePicture;

  return (
    <ul className={classes['nav_links-container']}>
      <li className={classes['user_img-container']}>
        <img
          src={userImage}
          alt='user'
          onClick={() => {
            navigate('/me/profile');
          }}
        />
      </li>
      <li className={classes['user_link-container']}>
        <NavLink className={classes['user_link']} to='/me/profile'>
          {props.user.username}
        </NavLink>
      </li>
      <li className={classes['setting-container']}>
        <Menu onLogout={props.onLogout} isLoggedIn={props.isLoggedIn} />
      </li>
    </ul>
  );
};

const NavBar = () => {
  const navigate = useNavigate();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const searchInputRef = useRef();

  const {
    sendRequest: _logout,
    status: logoutStatus,
    error: logoutError,
  } = useHttp(logout);

  const logoutHandler = () => {
    _logout();
    dispatch(authActions.setUser(null));
    dispatch(authActions.setBookmarks(null));
    dispatch(authActions.setLikedPosts(null));
    dispatch(authActions.logout());
    navigate('/', { replace: true });
  };

  const searchClickHandler = () => {
    const searchTerm = searchInputRef.current.value.trim();

    if (searchTerm === '') {
      return;
    }

    searchInputRef.current.value = '';

    navigate(`/search/${searchTerm}`);
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
          ref={searchInputRef}
          type='text'
          placeholder='Search...'
          className={classes['search_bar-input']}
        />
        <div
          className={classes['icon-container_sticky']}
          onClick={searchClickHandler}
        >
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
