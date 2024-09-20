// UserContext.js
import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      try {
        return jwtDecode(token);
      } catch (err) {
        console.error('Invalid token', err);
        return null;
      }
    }
    return null;
  });

  const login = (token) => {
    localStorage.setItem('userToken', token); // Store raw token
    const decodedUser = jwtDecode(token);
    setUser(decodedUser);
  };

  const logout = () => {
    localStorage.removeItem('userToken');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider };
