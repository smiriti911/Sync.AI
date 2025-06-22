'use client';

import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserContext } from '../context/user.context';

// ✅ Helper to decode JWT and check expiration
const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp;
    if (!exp) return true;
    return Date.now() >= exp * 1000; // exp is in seconds
  } catch (error) {
    return true; // If token is invalid or malformed, treat it as expired
  }
};

const UserAuth = ({ children }) => {
  const { user } = useContext(UserContext);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token || isTokenExpired(token)) {
      localStorage.removeItem('token'); // Clear token if expired or missing
      router.push('/login');
    } else if (user) {
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [user, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default UserAuth;
