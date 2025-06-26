'use client';
import Link from 'next/link';
import { FaPlus, FaFolderOpen } from 'react-icons/fa';
import { useProjects } from '../../context/project.context'; // Adjust path as needed

const SidePanel = () => {
  const { projects } = useProjects();

  return (
    <div className="group fixed top-0 left-0 z-50">
      {/* 🟦 Enlarged invisible hover trigger area */}
      <div
        className="absolute top-10 left-0 h-[90vh] w-20 z-10"
      />

      {/* 🌐 Floating Sidebar */}
      <aside
        className={`
          absolute top-14 left-0 h-[90vh] w-64
          transform -translate-x-full group-hover:translate-x-4
          bg-neutral-900/40 backdrop-blur-md border border-neutral-700/40
          rounded-xl overflow-hidden text-white shadow-2xl z-20
          transition-transform duration-300 ease-in-out
        `}
      >
        <div className="flex flex-col h-full px-4 py-6">
          <h2 className="text-lg font-semibold mb-6">Sync</h2>

          <nav className="flex flex-col gap-4">
            <Link
              href="/"
              className="flex items-center gap-3 text-sm hover:text-indigo-400 transition"
            >
              <FaPlus />
              New Chat
            </Link>

            <Link
              href="/userprojects"
              className="flex items-center gap-3 text-sm hover:text-indigo-400 transition"
            >
              <FaFolderOpen />
              Projects
            </Link>

            <div className="mt-6">
              <h4 className="text-xs uppercase tracking-wider text-neutral-400 mb-2">
                Recents
              </h4>
              <ul className="space-y-2 text-sm max-h-60 overflow-y-auto pr-1">
                {projects.length > 0 ? (
                  projects.map((project) => (
                    <li
                      key={project._id}
                      className="hover:text-indigo-300 cursor-pointer truncate"
                      title={project.name}
                    >
                      <Link href={`/userproject/${project._id}`}>
                        {project.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="text-neutral-500 italic">No projects found</li>
                )}
              </ul>
            </div>
          </nav>
        </div>
      </aside>
    </div>
  );
};

export default SidePanel;
