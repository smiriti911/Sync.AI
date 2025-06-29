"use client";

import { useState } from "react";
import HeroHeader from "./HeroHeader";
import InputBox from "./HeroInputBox";
import SuggestionList from "./HeroSuggestions";
import GradientBackground from "./GradientBackground";
import UserAuth from "../../auth/UserAuth";

import {BackgroundBeams} from "./BackgroundBeams"; // ✅ Import BackgroundBeams

export default function Hero({ setIsLoading }) {
  const [input, setInput] = useState("");
  const [showSidebar, setShowSidebar] = useState(false); // ✅ Sidebar toggle

  const suggestions = [
    ["Tic-Tac-Toe game ", "A simple TO-DO list app with React", "A Dashboard with interactive charts"],
    [
      "A minimal e-commerce store with product catalog, cart, checkout and order tracking.",
      "A personal blog with markdown support, comments, and social sharing.",
    ],
  ];

  const handleSubmit = () => {
    if (!input.trim()) return;
    console.log("Submitted:", input);
  };

  return (
    <UserAuth>
<section 
  className="relative w-full px-4 rounded-xl  overflow-hidden min-h-[80vh] shadow-2xl shadow-indigo-400/30 "

>


      {/* 🔮 Background Gradient */}
     <GradientBackground/>

      <BackgroundBeams className="absolute inset-0 pointer-events-none z-[-1]" />


      {/* 👤 Hero Content */}
      <div className="z-20 flex flex-col items-center text-white pt-30 pb-5 sm:pt-30 sm:pb-25">
        <HeroHeader />
        <InputBox
          input={input}
          setInput={setInput}
          onSubmit={handleSubmit}
          setIsLoading={setIsLoading}
        />
        <SuggestionList suggestions={suggestions} onSelect={setInput} />
      </div>
    </section>
    </UserAuth>
  );
}
