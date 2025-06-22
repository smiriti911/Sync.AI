"use client";

import React, { useState, useEffect } from 'react';
import { useSingleProject, SingleProjectProvider } from '../../../context/singleProject.context';
import { HiOutlineChatBubbleLeft } from "react-icons/hi2";
import ChatArea from '../../components/ChatArea';
import UserAuth from '../../../auth/UserAuth';
import { UserProvider } from '../../../context/user.context';
import Workspace from '../../components/Workspace';

const ProjectPageContent = () => {
  const { project } = useSingleProject();
  const [isChatVisible, setIsChatVisible] = useState(false);

  useEffect(() => {
    if (project) {
      console.log("Project details:", project);
    }
  }, [project]);

  const toggleChat = () => setIsChatVisible((prev) => !prev);
  const closeChat = () => setIsChatVisible(false);

  return (
    <div className="relative min-h-screen flex flex-col">

      {/* Toggle Chat Button */}
      <div className="">
        <button
          className=" rounded-full hover:bg-neutral-800/70 transition items-center flex justify-center"
          onClick={toggleChat}
        >
          <HiOutlineChatBubbleLeft className="text-3xl text-indigo-300" />
        </button>
      </div>

      {/* Workspace */}
      <div className="flex-grow overflow-auto">
        <Workspace />
      </div>

      {/* Chat Sidebar (Slide-in) */}
      <div
        className={`fixed top-0 left-0 h-full w-[400px] bg-neutral-900 z-50 transition-transform duration-500 ease-in-out ${
          isChatVisible ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <ChatArea onClose={closeChat} />
      </div>
    </div>
  );
};

const Project = () => {
  return (
    <UserProvider>
      <SingleProjectProvider>
        <UserAuth>
          <ProjectPageContent />
        </UserAuth>
      </SingleProjectProvider>
    </UserProvider>
  );
};

export default Project;
