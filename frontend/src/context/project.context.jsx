'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import axios from '../config/axios';
import { UserContext } from '../context/user.context';

const ProjectContext = createContext();

export const useProjects = () => useContext(ProjectContext);

export const ProjectProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    // Prevent API call if token is missing
    if (user && token) {
      axios
        .get('/projects/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => setProjects(res.data.projects))
        .catch((err) => console.error('Project fetch error:', err));
    }
  }, [user]);

  const createProject = (name, onClose) => {
  const token = localStorage.getItem('token');

  axios
    .post("/projects/create", { name })
    .then(() => {
      // Fetch updated project list after successful creation
      return axios.get("/projects/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    })
    .then((res) => {
      setProjects(res.data.projects); // update context
      onClose(); // close modal after update
    })
    .catch((err) => {
      console.error("Failed to create project or refresh list:", err);
    });
};
  return (
    <ProjectContext.Provider value={{  projects, setProjects, createProject }}>
      {children}
    </ProjectContext.Provider>
  );
};
