import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { FiUser } from "react-icons/fi";
import { useSingleProject } from '../../context/singleProject.context';
import axios from "../../config/axios";

const AddCollaborator = ({ isOpen, togglePanel, onSelect }) => {
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  // ✅ Access everything from one call to useSingleProject
  const { users, project, fetchProject } = useSingleProject();

  // ✅ Filter users not in project
  const usersNotInProject = users.filter(
    (user) => !project?.users?.some((pUser) => pUser._id === user._id)
  );

  // ✅ Toggle user selection
  const handleUserClick = (id) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  // ✅ Add users and refresh project data
  const handleAdd = async () => {
    try {
      const projectId = project._id;

      await axios.put('/projects/add-user', {
        projectId,
        users: selectedUserIds,
      });

      await fetchProject(); // ✅ Refresh project data

      onSelect(selectedUserIds);
      setSelectedUserIds([]);
      togglePanel();
    } catch (error) {
      console.error("Error adding collaborators:", error);
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full w-[400px] bg-neutral-900 shadow-md transition-transform transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } z-50`}
    >
      {/* Header */}
      <header className="bg-neutral-800/50 p-4 text-white flex justify-between items-center h-16">
        <h2 className="text-xl">Add Collaborator</h2>
        <button
          className="text-2xl hover:bg-neutral-700 transition rounded-full p-2"
          onClick={togglePanel}
        >
          <AiOutlineClose className="text-rose-400" />
        </button>
      </header>

      {/* User List */}
      <div className="overflow-y-auto h-[calc(100%-8rem)] custom-scrollbar">
        {usersNotInProject.map((user) => (
          <div
            key={user._id}
            onClick={() => handleUserClick(user._id)}
            className={`flex items-center justify-between text-white p-3 transition cursor-pointer ${
              selectedUserIds.includes(user._id)
                ? "bg-neutral-700/50"
                : "hover:bg-neutral-800/50"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center hover:bg-neutral-700 transition">
                <FiUser className="text-2xl text-emerald-300" />
              </div>
              <div>
                <h1 className="text-lg">{user.name}</h1>
                <p className="text-sm text-white">{user.email}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Button */}
      <div className="p-4">
        <button
          onClick={handleAdd}
          disabled={selectedUserIds.length === 0}
          className={`w-full py-2 rounded-md text-white text-sm transition ${
            selectedUserIds.length > 0
              ? "bg-emerald-400 hover:bg-indigo-400"
              : "bg-neutral-700 cursor-not-allowed"
          }`}
        >
          Add Collaborator{selectedUserIds.length > 1 ? "s" : ""}
        </button>
      </div>
    </div>
  );
};

export default AddCollaborator;
