'use client';

import React, { useEffect, useState } from 'react';
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackFileExplorer,
  SandpackPreview,
} from '@codesandbox/sandpack-react';
import Lookup from './Lookup';
import { useAiChat } from '@/context/AiChatContext';

const CodeView = ({ initialFiles, isGenerating, activeTab }) => {
  const { projectId } = useAiChat();
  const [files, setFiles] = useState({ ...Lookup.DEFAULT_FILE });

  useEffect(() => {
    if (initialFiles && Object.keys(initialFiles).length > 0) {
      setFiles((prevFiles) => ({
        ...Lookup.DEFAULT_FILE,
        ...initialFiles,
      }));
    }
  }, [initialFiles]);

  return (
    <div className="relative flex flex-col h-full">
      {/* 🔄 Loading Overlay */}
      {isGenerating && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="flex flex-col items-center text-white text-sm">
            <div className="flex space-x-1 mb-3">
              <span className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-3 h-3 bg-white rounded-full animate-bounce" />
            </div>
            Generating code...
          </div>
        </div>
      )}


      {/* 💻 Sandpack Workspace */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <SandpackProvider
          key={`sandpack-${Object.keys(files).length}`}
          template="react"
          theme={{
            colors: {
              surface1: "#0a0a0a",
              surface2: "#161b22",
              surface3: "#deebfc",
              base: "#c9d1d9",
              clickable: "#30363d",
              hover: "#30363d",
              accent: "#fafbfc",
              disabled: "#e1edfa",
              error: "#ff7b72",
              errorSurface: "#2a0000",
            },
            syntax: {
              plain: "#c9d1d9",
              comment: "#8b949e",
              keyword: "#81f791",
              tag: "#e0abff",
              string: "#f75ca6",
              punctuation: "#88c0f7",
              definition: "#7adffa",
              property: "#79c0ff",
              static: "#ffdf5d",
            },
            font: {
              body: "Fira Code, Menlo, monospace",
              monospace: "Fira Code, Menlo, monospace",
              size: "14px",
            },
          }}
          files={files}
          customSetup={{ dependencies: Lookup.DEPENDANCY }}
          options={{
            externalResources: ['https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4'],
          }}
        >
          <SandpackLayout className="flex flex-row h-[calc(100vh-56px)]">
            {activeTab === 'code' ? (
              <>
                <div className="w-[240px] h-full border-r border-neutral-800 overflow-y-auto">
                  <SandpackFileExplorer className="h-full" />
                </div>

                <div className="flex-1 h-full overflow-auto">
                  <SandpackCodeEditor className="h-full" />
                </div>
              </>
            ) : (
              <SandpackPreview className="min-h-screen" showNavigator />
            )}
          </SandpackLayout>
        </SandpackProvider>
      </div>
    </div>
  );
};

export default CodeView;
