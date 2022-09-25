import React from 'react';
import { Routes, Route } from 'react-router-dom';

import NavBar from './components/navbar/NavBar';
import MainPage from './components/main_page/MainPage';
import Signup from './components/auth/Signup';
import SigninForm from './components/auth/form/SigninForm';

function App() {
  return (
    <React.Fragment>
      <NavBar />
      <Routes>
        <Route path='/' element={<MainPage />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/signin' element={<SigninForm />} />
      </Routes>
    </React.Fragment>
  );
}

export default App;
