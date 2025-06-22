// components/CreateProjectModal.tsx
import React, { useState } from "react";
import { useProjects } from "../../context/project.context"; // adjust the path if needed

export default function CreateProjectModal({ onClose }) {
  const [projectName, setProjectName] = useState("");
  const { createProject } = useProjects(); // get function from context

  function handleSubmit(e) {
    e.preventDefault();
    createProject(projectName, onClose); // use context function
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-20">
      <div className="bg-neutral-900 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-neutral-200">
          Create New Project
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="projectName"
              className="block text-sm font-medium text-neutral-200"
            >
              Project Name
            </label>
            <input
              type="text"
              id="projectName"
              name="projectName"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-neutral-100 bg-neutral-800"
              required
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 bg-neutral-100 text-neutral-900 rounded-md"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
