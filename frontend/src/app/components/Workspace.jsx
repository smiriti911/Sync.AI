'use client';

import React, { useState } from 'react';
import AiChatView from './AiChatView';
import CodeView from './CodeView';
import { AiChatProvider } from '@/context/AiChatContext';

const Workspace = () => {
  // ✅ State to store files and generation status
  const [generatedFiles, setGeneratedFiles] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);

  // ✅ Handler passed to AiChatView
  const handleCodeGenerated = (files) => {
    setGeneratedFiles(files || {});
    setIsGenerating(false); // ✅ Stop loading when files are ready
  };

  return (
    <AiChatProvider>
      <div className="relative w-full px-0 overflow-x-hidden">
        <div className="flex flex-row w-full px-0">
          {/* ✅ AI Chat View with callbacks */}
          <div className="basis-3/5 lg:basis-2/5 relative z-10 lg:pl-0">
            <AiChatView
              onCodeGenerated={handleCodeGenerated}
              setIsGenerating={setIsGenerating}
            />
          </div>

          {/* ✅ Code View receives files + loading state */}
          <div className="basis-2/5 lg:basis-3/5 relative">
            <div className="absolute bg-black/50 lg:hidden z-[-10] pointer-events-none" />
            <CodeView initialFiles={generatedFiles} isGenerating={isGenerating} />
          </div>
        </div>
      </div>
    </AiChatProvider>
  );
};

export default Workspace;
