"use client";
import { useState } from "react";
import HeroHeader from "./HeroHeader";
import InputBox from "./HeroInputBox";
import SuggestionList from "./HeroSuggestions";

export default function Hero() {
  const [input, setInput] = useState("");

  const suggestions = [
    [
      "Tic-Tac-Toe game ",
      "A simple TO-DO list app with React",
      "A Dashboard with interactive charts",
    ],
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
    <section className="flex flex-col items-center text-white mt-40 md:mt-45 px-4">
      <HeroHeader />
      <InputBox input={input} setInput={setInput} onSubmit={handleSubmit} />
      <SuggestionList suggestions={suggestions} onSelect={setInput} />
    </section>
  );
}
