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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm">
      <div className="flex space-x-2">
        <span className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
        <span className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
        <span className="w-3 h-3 bg-white rounded-full animate-bounce" />
      </div>
    </div>
  );
}


  return <>{children}</>;
};

export default UserAuth;
