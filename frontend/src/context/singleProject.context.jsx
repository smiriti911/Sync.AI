'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import axios from '../config/axios';
import { useParams } from 'next/navigation';
import { initializeSocket, receiveMessage, sendMessage } from '@/config/socket';
import { UserContext } from './user.context';

const SingleProjectContext = createContext();

export const useSingleProject = () => useContext(SingleProjectContext);

export const SingleProjectProvider = ({ children }) => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const { user } = useContext(UserContext);
  const [messages, setMessages] = useState([]);

  const fetchProject = async () => {
    const token = localStorage.getItem('token');
    if (!token || !user) return;

    try {
      setLoading(true);
      const res = await axios.get(`/projects/get-project/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProject(res.data.project);
    } catch (err) {
      console.error('Fetch project error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    if (!token || !user) return;

    try {
      const res = await axios.get('users/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data.users);
    } catch (err) {
      console.error('Fetch users error:', err);
    }
  };

  useEffect(() => {
    if (id) fetchProject();
  }, [id, user]);

  useEffect(() => {
    fetchUsers();
  }, [user]);

  useEffect(() => {
    if (!project?._id) return;

    const socket = initializeSocket(project._id);
    console.log("Socket initialized for project:", project._id);

    const messageHandler = (data) => {
      console.log("Received message data:", data);
      setMessages(prev => [...prev, { 
        text: data.message, 
        sender: data.sender 
      }]);
    };

    socket.on('project-message', messageHandler);

    return () => {
      socket.off('project-message', messageHandler);
    };
  }, [project]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const messageData = {
      message: message,
      sender: user._id
    };

    console.log("Sending message:", messageData);
    setMessages(prev => [...prev, { text: message, sender: user._id }]);
    sendMessage('project-message', messageData);
    setMessage('');
  };

  return (
    <SingleProjectContext.Provider
      value={{
        project,
        loading,
        users,
        fetchProject,
        fetchUsers,
        handleSendMessage,
        message,
        setMessage,
        messages,
      }}
    >
      {children}
    </SingleProjectContext.Provider>
  );
};