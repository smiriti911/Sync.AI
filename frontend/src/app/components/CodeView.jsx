'use client';

import React, { useEffect, useState } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackFileExplorer,
  SandpackPreview,
} from "@codesandbox/sandpack-react";
import Lookup from "./Lookup";
import { useAiChat } from "@/context/AiChatContext";

const CodeView = ({ initialFiles, isGenerating }) => {
  const { projectId } = useAiChat();
  const [activeTab, setActiveTab] = useState("code");
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
    <div className="relative">
      {/* 🔄 Bouncing dots loader overlay */}
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

      <div className="bg-neutral-950/30 w-full p-2">
        <div className="flex items-center gap-3 rounded-3xl bg-neutral-950 p-1 w-36 justify-center">
          {["code", "preview"].map((tab) => (
            <h2
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-white text-sm px-2 py-1 cursor-pointer rounded-2xl transition ${
                activeTab === tab
                  ? "text-indigo-400 bg-indigo-500/50"
                  : "hover:text-indigo-300"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </h2>
          ))}
        </div>
      </div>

      <SandpackProvider
        key={`sandpack-${Object.keys(files).length}`}
        template="react"
        theme="dark"
        files={files}
        customSetup={{ dependencies: Lookup.DEPENDANCY }}
        options={{
          externalResources: ["https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"],
        }}
      >
        <SandpackLayout>
          {activeTab === "code" ? (
            <>
              <SandpackFileExplorer style={{ height: "86vh" }} />
              <SandpackCodeEditor style={{ height: "86vh" }} />
            </>
          ) : (
            <SandpackPreview style={{ height: "86vh" }} showNavigator />
          )}
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
};

export default CodeView;
