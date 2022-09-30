import { useSelector } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import NavBar from './components/navbar/NavBar';
import MainPage from './components/main_page/MainPage';
import PostDetail from './components/main_page/post_detail/PostDetail';
import Signup from './components/auth/Signup';
import SigninForm from './components/auth/form/SigninForm';

import classes from './App.module.css';

function App() {
  const navigate = useNavigate();
  const disableScroll = useSelector(
    (state) => state.mainPageScroll.disableScroll
  );

  const scrollClass = disableScroll ? classes['disable_scroll'] : '';

  return (
    <div className={`${classes['app-container']} ${scrollClass}`}>
      <NavBar />
      <Routes>
        <Route path='/' element={<Navigate replace to='/topic/general' />} />
        <Route path='/topic/:topicName' element={<MainPage />}>
          <Route
            path='post/:postId'
            element={<PostDetail onBackdropClick={() => navigate(-1)} />}
          />
        </Route>
        <Route path='/signup' element={<Signup />} />
        <Route path='/signin' element={<SigninForm />} />
      </Routes>
    </div>
  );
}

export default App;

//TODO: user profile page

//TODO: likes
//TODO: reply comment, create post (later)
//TODO: responsive (later later)
