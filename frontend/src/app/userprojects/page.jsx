// app/page.tsx or Home.tsx
"use client";

import React, { useState } from "react";
import { BsStars } from "react-icons/bs";
import { UserProvider } from "../../context/user.context";
import UserAuth from "../../auth/UserAuth";
import CreateProjectModal from "../components/CreateProjectModal";
import CreateProjectButton from "../components/CreateProjectButton";
import ProjectCard from "../components/ProjectCard";

export default function UserProjects() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <UserAuth>
      <main className="p-6">
        <div className="mb-6">
          <CreateProjectButton onClick={() => setIsModalOpen(true)} />
        </div>

        {isModalOpen && (
          <CreateProjectModal onClose={() => setIsModalOpen(false)} />
        )}

        <ProjectCard />
      </main>
    </UserAuth>
  );
}
