"use client";

import { useState } from "react";
import HeroHeader from "./HeroHeader";
import InputBox from "./HeroInputBox";
import SuggestionList from "./HeroSuggestions";
import GradientBackground from "./GradientBackground";
import Orb from "./Orb";
import SideBar from "./SideBar"; // 👈 Make sure path is correct

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
    <section className="relative w-full px-4 rounded-xl border border-neutral-800 overflow-hidden min-h-[90vh]">

      {/* 🔮 Background Gradient */}
      <GradientBackground />

      {/* 🌀 Orb */}
      <div className="absolute top-0 left-0 w-full h-full -z-20 overflow-hidden">
        <div className="absolute top-[-90px] left-1/2 -translate-x-1/2 w-[550px] h-[550px] sm:w-[650px] sm:h-[650px]">
          <Orb
            hoverIntensity={0.5}
            rotateOnHover={true}
            hue={0}
            forceHoverState={false}
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
  );
}
