"use client";

import React, { useState } from "react";
import { UserProvider } from "../context/user.context";
import UserAuth from "../auth/UserAuth";
import Header from "./components/Header";
import Hero from "./components/Hero";
import SideBar from "./components/SideBar";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <UserAuth>
      <Header />

      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-2">
            <div className="flex space-x-1">
              <span className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-3 h-3 bg-white rounded-full animate-bounce" />
            </div>
            <span className="text-white text-sm mt-2">Creating your project...</span>
          </div>
        </div>
      )}
         <div className="px-4 md:px-8 lg:px-16">
        <Hero setIsLoading={setIsLoading} />
      </div>

      <SideBar/>

    </UserAuth>
  );
}
