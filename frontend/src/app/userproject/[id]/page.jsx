'use client';

import React, { useState, useEffect } from 'react';
import { useSingleProject, SingleProjectProvider } from '../../../context/singleProject.context';
import ChatArea from '../../components/ChatArea';
import UserAuth from '../../../auth/UserAuth';
import { UserProvider } from '../../../context/user.context';
import Workspace from '../../components/Workspace';

const ProjectPageContent = () => {
  const { project } = useSingleProject();
  const [isChatVisible, setIsChatVisible] = useState(false);


  const toggleChat = () => setIsChatVisible((prev) => !prev);
  const closeChat = () => setIsChatVisible(false);

  return (
<div className="relative min-h-screen flex flex-col bg-neutral-950">
  {/* Chat Sidebar */}
  <div
    className={`fixed top-0 left-0 h-full w-[400px] z-50 transition-transform duration-500 ease-in-out ${
      isChatVisible ? 'translate-x-0' : '-translate-x-full'
    }`}
  >
    <ChatArea onClose={closeChat} />
  </div>

  {/* Dim Overlay when Chat is Open */}
  {isChatVisible && (
    <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity duration-300" />
  )}

  {/* Workspace (placed below chat, above background) */}
  <div className={`relative z-30 transition-all duration-300 ${isChatVisible ? 'pointer-events-none select-none blur-sm opacity-60' : ''}`}>
    <Workspace
      onToggleUserChat={toggleChat}
      isUserChatVisible={isChatVisible}
    />
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
