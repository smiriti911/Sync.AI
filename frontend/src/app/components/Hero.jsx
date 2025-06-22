"use client";
import { useState } from "react";
import HeroHeader from "./HeroHeader";
import InputBox from "./HeroInputBox";
import SuggestionList from "./HeroSuggestions";

export default function Hero() {
  const [input, setInput] = useState("");

  const suggestions = [
    [
      "Social media dashboard with analytics",
      "A portfolio website showcasing development projects with live demos, GitHub links and tech stack details. Include a skills section and contact form.",
      "A dynamic video using Remotion that animates code snippets, logos and text transitions. Include smooth animations and a modern tech theme.",
    ],
    [
      "A minimal e-commerce store with product catalog, cart, checkout and order tracking. Just the UI first, I'll add stripe payment later.",
      "Real-time chat with socket.io",
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
