'use client';

import React, { useState } from 'react';
import AiChatView from './AiChatView';
import CodeView from './CodeView';
import { AiChatProvider } from '@/context/AiChatContext';

const Workspace = () => {
  const [generatedFiles, setGeneratedFiles] = useState([]);

  return (
    <AiChatProvider>
      <div className="relative w-full px-0 overflow-x-hidden">
        <div className="flex flex-row w-full px-0">
          <div className="basis-3/5 lg:basis-2/5 relative z-10 lg:pl-0">
            <AiChatView onFilesGenerated={setGeneratedFiles} />
          </div>
          <div className="basis-2/5 lg:basis-3/5 relative">
            <div className="absolute bg-black/50 lg:hidden z-[-10] pointer-events-none" />
            <CodeView generatedFiles={generatedFiles} />
          </div>
        </div>
      </div>
    </AiChatProvider>
  );
};

export default Workspace;
