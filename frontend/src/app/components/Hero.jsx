"use client";

import { useState } from "react";
import HeroHeader from "./HeroHeader";
import InputBox from "./HeroInputBox";
import SuggestionList from "./HeroSuggestions";
import GradientBackground from "./GradientBackground";
import Orb from "./Orb";
import UserAuth from "../../auth/UserAuth";

import Aurora from "./Aurora";
 // 👈 Make sure path is correct

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
    <section className="relative w-full px-4 rounded-xl border border-neutral-800 overflow-hidden min-h-[90vh]">

      {/* 🔮 Background Gradient */}
     <GradientBackground/>

 {/* 🌀 Orb (Aurora background) */}
<div className="absolute left-0 w-full h-[700px] -z-10">
  <div className="w-full h-full">
    <Aurora
      colorStops={["#FDC77C", "#FF66EB", "#6D48FE"]}
      blend={0.5}
      amplitude={0.3}
      speed={0.5}
    />
  </div>
</div>



      {/* 👤 Hero Content */}
      <div className="relative z-10 flex flex-col items-center text-white pt-40 pb-5 sm:pt-45 sm:pb-10">
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
