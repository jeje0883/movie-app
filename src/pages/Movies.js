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
    setLoading(false); // Stop loading after checking the user state
  }, [user]);

  if (loading) {
    return <div>Loading...</div>; // Display a loading message or spinner
  }

  return (
    <>
      {/* Render AdminDash if user is logged in and an admin */}
      {user && user.isAdmin ? (
        <AdminDash />
      ) : (
        /* Render UserDash if the user is not logged in or not an admin */
        <UserDash />
      )}
    </>
  );
};

export default Movies;
