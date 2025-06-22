// app/page.tsx or Home.tsx
"use client";

import React, { useState } from "react";
import { BsStars } from "react-icons/bs";
import { UserProvider } from "../context/user.context";
import UserAuth from "../auth/UserAuth";
import CreateProjectModal from "./components/CreateProjectModal";
import CreateProjectButton from "./components/CreateProjectButton";
import ProjectCard from "./components/ProjectCard";
import Hero from "./components/Hero"; // Adjust the import path as necessary

import Header from "./components/Header"; // Adjust the import path as necessary
import UserProjects from "./userprojects/page";
import GradientBackground from "./components/GradientBackground";


import Orb from "./components/Orb";
export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

   return (
    <UserAuth>
      <Header />
       <GradientBackground/>
      {/* Orb in the background behind Hero */}
      <div
        style={{
          position: "absolute",
          top: -70,
          left: 0,
          width: "100%",
          height: "100vh",
          zIndex: -20, // Send behind Hero
          overflow: "hidden",
        }}
      >
        <Orb
          hoverIntensity={0.5}
          rotateOnHover={true}
          hue={0}
          forceHoverState={false}
        />
      </div>

      <main className="">
        <Hero />
      </main>
    </UserAuth>
  );
}

{/* <div className="mb-6">
          <CreateProjectButton onClick={() => setIsModalOpen(true)} />
        </div>

        {isModalOpen && (
          <CreateProjectModal onClose={() => setIsModalOpen(false)} />
        )}

        <ProjectCard /> */}
