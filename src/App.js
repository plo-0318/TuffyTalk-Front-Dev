import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { authActions } from './store/auth';
import { mainPageScrollActions } from './store/mainPageScroll';
import useHttp from './hooks/use-http';
import { loginWithJWT } from './utils/sendHttp';

import LoadingSpinner from './components/ui/loading_spinner/LoadingSpinner';
import NavBar from './components/navbar/NavBar';
import MainPage from './components/main_page/MainPage';
import PostDetail from './components/main_page/post_detail/PostDetail';
import Signup from './components/auth/Signup';
import SigninForm from './components/auth/form/SigninForm';
import UserProfile from './components/user_profile_page/UserProfile';
import SearchResult from './components/search_result_page/SearchResult';
import ErrorPage from './components/error_page/ErrorPage';

import classes from './App.module.css';
import { Fragment } from 'react';

function App() {
  const location = useLocation();
  const { pathname } = location;

  const disableScroll = useSelector(
    (state) => state.mainPageScroll.disableScroll
  );
  const savedScrollPos = useSelector(
    (state) => state.mainPageScroll.scrollPosition
  );

  const scrollClass = disableScroll ? classes['disable_scroll'] : '';

  const dispatch = useDispatch();
  const [render, setRender] = useState(false);

  const {
    sendRequest: loginJWT,
    data: userData,
    status: loginStatus,
    error: loginError,
  } = useHttp(loginWithJWT);

  useEffect(() => {
    loginJWT(true);
  }, [loginJWT]);

  useEffect(() => {
    if (loginStatus === 'completed') {
      if (userData !== null) {
        dispatch(authActions.setUser(userData));
        dispatch(authActions.login());
      }

      setRender(true);
    }
  }, [userData, dispatch, loginStatus]);

  useEffect(() => {
    if (pathname.split('/').length > 3) {
      dispatch(mainPageScrollActions.setDisableScroll(true));
    } else {
      dispatch(mainPageScrollActions.setDisableScroll(false));
    }
  }, [pathname, dispatch]);

  useEffect(() => {
    if (!disableScroll && location.state && location.state.restoreScroll) {
      window.scrollTo(0, savedScrollPos);
    }
  }, [location, savedScrollPos, disableScroll]);

  return (
    <div className={`${classes['app-container']} ${scrollClass}`}>
      {!render && <LoadingSpinner />}
      {render && (
        <Fragment>
          <NavBar />
          <Routes>
            <Route
              path='/'
              element={<Navigate replace to='/topic/general' />}
            />
            <Route path='/topic/:topicName' element={<MainPage />}>
              <Route path='post/:postId' element={<PostDetail />} />
            </Route>
            <Route path='/signup' element={<Signup />} />
            <Route path='/signin' element={<SigninForm />} />
            <Route path='/me/:tab' element={<UserProfile />}>
              <Route path=':postId' element={<PostDetail />} />
            </Route>
            <Route path='/search/:searchTerm' element={<SearchResult />}>
              <Route path='post/:postId' element={<PostDetail />} />
            </Route>
            <Route path='*' element={<ErrorPage />} />
          </Routes>
        </Fragment>
      )}
    </div>
  );
}

export default App;

//TODO: change post pages change url (maybe later)
//TODO: email verification?
