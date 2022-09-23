import React from 'react';
import { Routes, Route } from 'react-router-dom';

import NavBar from './components/navbar/NavBar';
import MainPage from './components/main_page/MainPage';
import Signup from './components/signup/Signup';

function App() {
  return (
    <React.Fragment>
      <NavBar />
      <Routes>
        <Route path='/' element={<MainPage />} />
        <Route path='/signup' element={<Signup />} />
      </Routes>
    </React.Fragment>
  );
}

export default App;
