"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Red_Rose } from "next/font/google";
import { HiMenuAlt2 } from "react-icons/hi";
import axios from "../../config/axios";

const rubik = Red_Rose({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const Header = ({setIsSidebarOpen}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

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

      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("userId");

      // Redirect to login page
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <header className="w-full flex justify-between items-center px-2 sm:px-3 lg:px-11 xl:px-15 py-3 lg:py-3">
      {/* Logo and Text Logo */}
      <div className="flex items-center gap-1">
        <button className="text-indigo-300 text-3xl block sm:hidden cursor-pointer" onClick={()=> setIsSidebarOpen(true)}>
          <HiMenuAlt2 />
        </button>

        <Image
          src="/logo11.png"
          alt="Logo"
          width={28}
          height={28}
          className="mb-1"
        />
        <span
          className={`${rubik.className} text-3xl sm:text-3xl font-bold text-amber-50 tracking-tight hidden  sm:block`}
        >
          Sync
        </span>
      </div>

      {/* Auth Buttons */}
      <div className="flex gap-2">
        {isLoggedIn ? (
          <button
            className="text-sm font-medium px-3 py-[6px] sm:px-4 sm:py-[6px] rounded-md text-white bg-neutral-800 hover:bg-blue-500 border border-neutral-600 transition-colors duration-200 hover:border-blue-500"
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <>
            <Link href="/login">
              <button className="text-sm font-medium px-3 py-[6px] sm:px-4 sm:py-[6px] rounded-md text-white bg-neutral-800 hover:bg-blue-500 border border-neutral-600 transition-colors duration-200 hover:border-blue-500">
                Sign in
              </button>
            </Link>
            <Link href="/register">
              <button className="text-sm font-medium px-3 py-[6px] sm:px-4 sm:py-[6px] rounded-md text-black bg-white hover:bg-neutral-200 border border-neutral-600 transition-colors duration-200 hover:border-neutral-200">
                Sign up
              </button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
