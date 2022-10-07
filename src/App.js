import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { authActions } from './store/auth';
import useHttp from './hooks/use-http';
import { loginWithJWT } from './utils/sendHttp';

import LoadingSpinner from './components/ui/loading_spinner/LoadingSpinner';
import NavBar from './components/navbar/NavBar';
import MainPage from './components/main_page/MainPage';
import PostDetail from './components/main_page/post_detail/PostDetail';
import Signup from './components/auth/Signup';
import SigninForm from './components/auth/form/SigninForm';
import UserProfile from './components/user_profile_page/UserProfile';

import classes from './App.module.css';
import { Fragment } from 'react';

function App() {
  const navigate = useNavigate();

  const disableScroll = useSelector(
    (state) => state.mainPageScroll.disableScroll
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
              <Route
                path='post/:postId'
                element={<PostDetail onBackdropClick={() => navigate(-1)} />}
              />
            </Route>
            <Route path='/signup' element={<Signup />} />
            <Route path='/signin' element={<SigninForm />} />
            <Route path='/me/:tab' element={<UserProfile />}>
              <Route
                path=':postId'
                element={<PostDetail onBackdropClick={() => navigate(-1)} />}
              />
            </Route>
          </Routes>
        </Fragment>
      )}
    </div>
  );
}

export default App;

//TODO: error page
//TODO: user img

//TODO: likes
//TODO: reply comment, create post (later)
//TODO: responsive (later later)
