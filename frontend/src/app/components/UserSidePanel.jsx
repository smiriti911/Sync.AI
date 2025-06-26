import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import { FiUser } from "react-icons/fi";
import { useSingleProject } from "../../context/singleProject.context";

const SidePanel = ({ isOpen, togglePanel }) => {
  const { project } = useSingleProject();

  const loggedInUserId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  const users = project?.users || [];

  return (
    <div
      className={`fixed w-[385px] mb-2 mx-2 mt-11 transition-transform duration-300 ease-in-out h-[calc(100%-3.25rem)] 
        rounded-2xl border border-neutral-700 shadow-lg backdrop-blur-lg bg-neutral-950
        overflow-hidden flex flex-col z-50
        ${isOpen ? "translate-x-0" : "-translate-x-[calc(100%+1rem)]"}`}
    >
      {/* Header */}
      <header className="flex justify-between items-center bg-neutral-900/50 h-12 px-4 rounded-t-2xl border-b border-neutral-800">
        <h2 className="text-white text-lg font-semibold">Collaborators</h2>
        <button
          onClick={togglePanel}
          className="text-rose-400 hover:bg-neutral-800/70 p-2 rounded-full transition"
        >
          <AiOutlineClose className="text-xl" />
        </button>
      </header>

      {/* Collaborators List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hidden">
        {users.length > 0 ? (
          users.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-4 p-3 rounded-xl text-white hover:bg-neutral-800/50 transition cursor-default"
            >
              <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center">
                <FiUser className="text-emerald-300 text-xl" />
              </div>
              <div>
                <h1 className="text-sm font-semibold">
                  {user.name}{" "}
                  {user._id === loggedInUserId && (
                    <span className="text-xs text-emerald-400">(You)</span>
                  )}
                </h1>
                <p className="text-xs text-white/70">{user.email}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-white/60 text-sm">No collaborators found.</p>
        )}
      </div>
    </div>
  );
};

export default SidePanel;
