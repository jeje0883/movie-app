import './App.css';
import React from 'react';
import { BrowserRouter, Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Movies from './pages/Movies';
import NavBar from './components/NavBar';
import NotFound from './pages/404';



function App() {
  return (
    <UserProvider>
      <BrowserRouter>
      <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="*" element={<NotFound />} /> 
          </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
