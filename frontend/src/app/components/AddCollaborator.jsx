import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { FiUser } from "react-icons/fi";
import { useSingleProject } from "../../context/singleProject.context";
import axios from "../../config/axios";

const AddCollaborator = ({ isOpen, togglePanel, onSelect }) => {
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const { users, project, fetchProject } = useSingleProject();

  const usersNotInProject = users.filter(
    (user) => !project?.users?.some((pUser) => pUser._id === user._id)
  );

  const handleUserClick = (id) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const handleAdd = async () => {
    try {
      const projectId = project._id;

      await axios.put("/projects/add-user", {
        projectId,
        users: selectedUserIds,
      });

      await fetchProject();
      onSelect(selectedUserIds);
      setSelectedUserIds([]);
      togglePanel();
    } catch (error) {
      console.error("Error adding collaborators:", error);
    }
  };

  return (
    <div
      className={`fixed w-[385px] top-[2.75rem] left-2 transition-transform z-50 duration-300 ease-in-out h-[calc(100%-3.25rem)] 
      rounded-2xl border border-neutral-700 backdrop-blur-lg bg-neutral-950
      overflow-hidden flex flex-col
     ${isOpen ? "translate-x-0" : "-translate-x-[calc(100%+1rem)]"}
`}
    >
      {/* Header */}
      <header className="flex justify-between items-center bg-neutral-900/50 h-12 px-4 rounded-t-2xl border-b border-neutral-800">
        <h2 className="text-white text-lg font-semibold">Add Collaborator</h2>
        <button
          onClick={togglePanel}
          className="text-rose-400 hover:bg-neutral-800/70 p-2 rounded-full transition"
        >
          <AiOutlineClose className="text-xl" />
        </button>
      </header>

      {/* User List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hidden">
        {usersNotInProject.length === 0 ? (
          <p className="text-white/60 text-sm">All users are already added.</p>
        ) : (
          usersNotInProject.map((user) => (
            <div
              key={user._id}
              onClick={() => handleUserClick(user._id)}
              className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition
              ${selectedUserIds.includes(user._id)
                  ? "bg-neutral-700/60"
                  : "hover:bg-neutral-800/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center">
                  <FiUser className="text-emerald-300 text-xl" />
                </div>
                <div>
                  <h1 className="text-white text-sm font-semibold">
                    {user.name}
                  </h1>
                  <p className="text-xs text-white/70">{user.email}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Button */}
      <div className="p-4 border-t border-neutral-800 bg-neutral-950/80 rounded-b-2xl">
        <button
          onClick={handleAdd}
          disabled={selectedUserIds.length === 0}
          className={`w-full py-2 rounded-md text-sm font-medium transition
            ${selectedUserIds.length > 0
              ? "bg-emerald-400 hover:bg-indigo-400 text-black"
              : "bg-neutral-700 text-white/50 cursor-not-allowed"
            }`}
        >
          Add Collaborator{selectedUserIds.length > 1 ? "s" : ""}
        </button>
      </div>
    </div>
  );
};

export default AddCollaborator;
