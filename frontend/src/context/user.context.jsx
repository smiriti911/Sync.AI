"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Fetch user from localStorage or initialize
  useEffect(() => {
    const storedUser = localStorage.getItem('userId');
    if (storedUser) {
      // Here, you could also call an API to fetch full user details by ID if needed
      setUser({ _id: storedUser });  // Set user context from localStorage
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};