// src/pages/Movies.js
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import '../styles/sharedStyles.css'; // Import the CSS file

import AdminDash from '../components/AdminDash';
import UserDash from '../components/UserDash';

const Movies = () => {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(false); // Stop loading when user data is available
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>; // Display a loading message or spinner
  }

  return (
    <>
      {user.isAdmin ? <AdminDash /> : <UserDash />}
    </>
  );
};

export default Movies;
