"use client";

import React from "react";
import { BsStars } from "react-icons/bs";

export default function CreateProjectButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="p-4 border border-neutral-300 rounded-xl flex items-center bg-neutral-900 hover:bg-neutral-800 transition duration-200 ease-in-out"
    >
      <span className="text-lg text-white">Create Project</span>
      <BsStars className="text-2xl text-indigo-200" />
    </button>
  );
}
