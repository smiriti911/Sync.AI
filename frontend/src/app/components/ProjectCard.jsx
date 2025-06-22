"use client";

import React, { useEffect, useState } from 'react';
import axios from '../../config/axios';
import { MdGroups } from "react-icons/md";
import { useRouter } from 'next/navigation';
import { useProjects } from '../../context/project.context'; // Adjust the import path as necessary


const ProjectCard = () => {
  const { projects } = useProjects(); // 🔄 context instead of local state
  const router = useRouter();

  const handleCardClick = (project) => {
    router.push(`/userproject/${project._id}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
      {projects.map((project) => (
        <div
          key={project._id}
          onClick={() => handleCardClick(project)}
          className="bg-neutral-900 h-48 flex flex-col items-center justify-center border border-neutral-300 rounded-xl cursor-pointer hover:bg-neutral-800 transition duration-200 ease-in-out text-white shadow-md p-4"
        >
          <div className="text-2xl font-semibold mb-2 text-center">
            {project.name}
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-300">
            <MdGroups className="text-3xl text-emerald-300" />
            <span>
              {project.users?.length ?? 0} {project.users?.length === 1 ? "user" : "collaborators"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectCard;
