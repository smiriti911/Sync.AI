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

const CodeView = ({ generatedFiles }) => {
  const [activeTab, setActiveTab] = useState("code");
  const [files, setFiles] = useState(Lookup?.DEFAULT_FILE || {});
  const [version, setVersion] = useState(0);

  // 🔄 Update files when new generatedFiles come in
  useEffect(() => {
    if (!generatedFiles?.length) return;

    const validFiles = generatedFiles.filter(
      (f) => f?.name && typeof f.content === "string" && f.content.trim()
    );

    if (!validFiles.length) return;

    const newFiles = Object.fromEntries(
      validFiles.map((f) => [f.name, { code: f.content }])
    );

    const merged = {
      ...Lookup.DEFAULT_FILE,
      ...newFiles,
    };

    setFiles(merged);
    setVersion((v) => v + 1); // Force re-render
  }, [generatedFiles]);

  return (
    <div>
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
        key={`sandpack-${version}`} // 🔁 Refresh on file update
        template="react"
        theme="dark"
        files={files}
        customSetup={{ dependencies: Lookup.DEPENDANCY }}
        options={{
          externalResources: [
            "https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4",
          ],
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
