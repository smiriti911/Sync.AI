'use client';

import React, { useState, useRef, useEffect } from 'react';
import AiChatView from './AiChatView';
import CodeView from './CodeView';
import { AiChatProvider } from '@/context/AiChatContext';
import Header from './WorkspaceHeader';
import SideBar from './SideBar';


const Workspace = ({ onToggleUserChat, isUserChatVisible }) => {
  const [generatedFiles, setGeneratedFiles] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('code');
  const [showChat, setShowChat] = useState(true);

  // Resize state
  const [chatWidth, setChatWidth] = useState(500); // default 500px
  const isDragging = useRef(false);

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const newWidth = Math.min(Math.max(e.clientX, 300), window.innerWidth - 300);
    setChatWidth(newWidth);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.body.style.userSelect = '';
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleMouseDown = () => {
    isDragging.current = true;
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleCodeGenerated = (files) => {
    setGeneratedFiles(files || {});
    setIsGenerating(false);
  };

  return (
    <AiChatProvider>
      <div className="w-full h-screen flex flex-col overflow-hidden bg-neutral-950">
              <SideBar/>
        {/* Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          showChat={showChat}
          setShowChat={setShowChat}
          onToggleUserChat={onToggleUserChat}
          isUserChatVisible={isUserChatVisible}
        />

        {/* Main content */}
        <div className="flex flex-1 overflow-hidden px-2 pb-2 relative">
          
          {/* AI Chat Panel */}
          {showChat && (
            <div
              style={{ width: chatWidth }}
              className="h-full overflow-hidden rounded-xl border border-neutral-700"
            >
              <AiChatView
                onCodeGenerated={handleCodeGenerated}
                setIsGenerating={setIsGenerating}
              />
            </div>
          )}

          {/* Resizer */}
          {showChat && (
            <div
              onMouseDown={handleMouseDown}
              className="w-[6px] cursor-col-resize bg-neutral-950 hover:bg-neutral-800/50 transition rounded-2xl"
            />
          )}

          {/* Code Editor */}
          <div className="flex-1 h-full overflow-hidden rounded-xl border border-neutral-700 relative">
            <div className="absolute bg-black/50 lg:hidden z-[-10] pointer-events-none" />
            <CodeView
              initialFiles={generatedFiles}
              isGenerating={isGenerating}
              activeTab={activeTab}
            />
          </div>
        </div>
      </div>
    </AiChatProvider>
  );
};

export default Workspace;
