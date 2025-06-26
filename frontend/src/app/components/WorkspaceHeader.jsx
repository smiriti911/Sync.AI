"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Red_Rose } from 'next/font/google';
import axios from '../../config/axios';
import { FaCode } from "react-icons/fa6";
import { BsStars, BsLayoutSidebar } from "react-icons/bs";
import { HiOutlineChatBubbleLeft } from "react-icons/hi2"; // user chat icon
import { useSingleProject } from '../../context/singleProject.context';


const rubik = Red_Rose({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const Header = ({ activeTab, setActiveTab, showChat, setShowChat, onToggleUserChat, isUserChatVisible }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const { project } = useSingleProject();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      await axios.get(`/users/logout`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <header className="w-full flex justify-between items-center px-3 sm:px-5 lg:px-10 py-1 bg-neutral-950">
      
      {/* Left: Logo + Toggles */}
      <div className="flex items-center gap-3">
        {/* Logo */}
        <button onClick={() => router.push('/')} className="flex items-center gap-2">
          <Image src="/logo11.png" alt="Logo" width={26} height={26} />
        </button>
        {project?.name && (
          <span className="truncate text-lg sm:text-lg text-white/60 font-medium max-w-[160px] sm:max-w-xs">
            • {project.name}
          </span>
        )}



      </div>
 
      {/* Right: Tabs + Auth */}
      <div className="flex items-center gap-4">

        
        {/* Toggle AI Chat */}
        <button
          onClick={() => setShowChat(prev => !prev)}
          title={showChat ? "Hide AI Chat" : "Show AI Chat"}
          className="p-[6px] rounded-lg border border-neutral-800 hover:bg-neutral-700/50 bg-neutral-950"
        >
          <BsLayoutSidebar className="w-5 h-5 text-white" />
        </button>
                {/* Toggle User Chat */}
       <button
  onClick={onToggleUserChat}
  title={isUserChatVisible ? "Hide Chat Area" : "Show Chat Area"}
  className={`p-1 rounded-lg border border-neutral-800 hover:bg-neutral-700/50 ${
    isUserChatVisible ? 'bg-neutral-700' : 'bg-neutral-950'
  }`}
>
  <HiOutlineChatBubbleLeft className="w-6 h-6 text-white" />
</button>
        {/* Tabs */}
        <div
          className={`items-center gap-1 bg-neutral-950 p-[3px] rounded-xl border border-neutral-800 
          ${showChat ? 'hidden sm:flex lg:flex' : 'flex'}`}
        >
          {[{ key: 'code', icon: <FaCode className="w-4 h-4" /> }, { key: 'preview', icon: <BsStars className="w-4 h-4" /> }].map(({ key, icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              title={key.charAt(0).toUpperCase() + key.slice(1)}
              className={`p-[6px] rounded-lg transition ${
                activeTab === key
                  ? 'bg-neutral-700/60 text-white'
                  : 'text-white hover:text-neutral-300'
              }`}
            >
              {icon}
            </button>
          ))}
        </div>

        {/* Auth */}
        <div className="flex gap-1 sm:gap-2">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="text-xs sm:text-sm font-medium px-3 py-[4px] rounded-md text-white bg-neutral-800 hover:bg-blue-500 border border-neutral-600 transition"
            >
              Logout
            </button>
          ) : (
            <>
              <Link href="/login">
                <button className="text-xs sm:text-sm font-medium px-3 py-[4px] rounded-md text-white bg-neutral-800 hover:bg-blue-500 border border-neutral-600 transition">
                  Sign in
                </button>
              </Link>
              <Link href="/register">
                <button className="text-xs sm:text-sm font-medium px-3 py-[4px] rounded-md text-black bg-white hover:bg-neutral-200 border border-neutral-600 transition">
                  Sign up
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
