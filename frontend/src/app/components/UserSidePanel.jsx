// SidePanel.js
import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import { FiUser } from "react-icons/fi";
import { useSingleProject } from "../../context/singleProject.context";

const SidePanel = ({ isOpen, togglePanel }) => {
  const { project } = useSingleProject();

  // Get logged-in user ID (assuming stored in localStorage)
  const loggedInUserId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  const users = project?.users || [];

  return (
    <div
      className={`fixed top-0 left-0 h-full w-[400px] bg-neutral-900 shadow-md transition-transform transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } z-50`}
    >
      {/* Header */}
      <header className="bg-neutral-800/50 p-4 text-white flex justify-between items-center h-16">
        <h2 className="text-xl">Collaborators</h2>
        <button
          className="text-2xl hover:bg-neutral-700 transition rounded-full p-2"
          onClick={togglePanel}
        >
          <AiOutlineClose className="text-rose-400" />
        </button>
      </header>

      {/* Collaborators List (including self) */}
      <div className="overflow-y-auto h-[calc(100%-4rem)] custom-scrollbar">
        {users.length > 0 ? (
          users.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-4 p-3 text-white hover:bg-neutral-800/50 transition duration-300 w-full"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-neutral-800 rounded-full hover:bg-neutral-700 transition">
                <FiUser className="text-2xl text-emerald-300" />
              </div>
              <div>
                <h1 className="text-lg">
                  {user.name}{" "}
                  {user._id === loggedInUserId && (
                    <span className="text-xs text-emerald-400">(You)</span>
                  )}
                </h1>
                <p className="text-white">{user.email}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-white p-4">No collaborators found.</p>
        )}
      </div>
    </div>
  );
};

export default SidePanel;
