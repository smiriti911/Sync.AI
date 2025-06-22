"use client";

import React, { useState, useContext } from 'react';
import Link from 'next/link';
import axios from '../../config/axios';
import { useRouter } from 'next/navigation';

import { UserContext } from '../../context/user.context';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { setUser } = useContext(UserContext);

  const router = useRouter();

  function submitHandler(e) {
    e.preventDefault();
    axios
      .post('/users/login', {
        email,
        password,
      })
      .then((res) => {
        console.log(res.data);

        // Store the token and user ID in localStorage
        localStorage.setItem('token', res.data.token);

        localStorage.setItem('userId', res.data.user._id);  // Store the user ID

        setUser(res.data.user);
        
        router.push('/');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-neutral-900 rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-neutral-100 mb-6 text-center">Welcome Back</h1>
        <form className="space-y-5" onSubmit={submitHandler}>
          <div>
            <label className="block text-neutral-300 text-sm mb-1">Email</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-lg bg-neutral-800 text-neutral-100 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-600"
            />
          </div>
          <div>
            <label className="block text-neutral-300 text-sm mb-1">Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 rounded-lg bg-neutral-800 text-neutral-100 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-600"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-white text-neutral-900 font-semibold rounded-lg hover:bg-neutral-200 transition-colors duration-300"
          >
            Login
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-neutral-400">
          Don't have an account?{' '}
          <Link href="/register" className="text-neutral-100 underline hover:text-neutral-300">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
