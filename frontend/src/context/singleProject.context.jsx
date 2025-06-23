'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import axios from '../config/axios';
import { useParams } from 'next/navigation';
import { initializeSocket, sendMessage } from '@/config/socket';
import { UserContext } from './user.context';

const SingleProjectContext = createContext();
export const useSingleProject = () => useContext(SingleProjectContext);

export const SingleProjectProvider = ({ children }) => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const { user } = useContext(UserContext);

  // Fetch project details
  const fetchProject = async () => {
    const token = localStorage.getItem('token');
    if (!token || !user) return;

    try {
      setLoading(true);
      const res = await axios.get(`/projects/get-project/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProject(res.data.project);
    } catch (err) {
      console.error('❌ Fetch project error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    if (!token || !user) return;

    try {
      const res = await axios.get('/users/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.users);
    } catch (err) {
      console.error('❌ Fetch users error:', err);
    }
  };

  // Fetch chat history
  const fetchPersistedMessages = async () => {
    const token = localStorage.getItem('token');
    if (!token || !project?._id) return;

    try {
      const res = await axios.get(`/projects/${project._id}/user-messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const fetched = res.data.messages || [];
      setMessages(
  fetched.map((m) => ({
    text: m.message,
    senderId: typeof m.sender === 'object' ? m.sender._id : m.sender,
    senderEmail: typeof m.sender === 'object' ? m.sender.email : null,
    timestamp: m.timestamp,
  }))
);
    } catch (err) {
      console.error('❌ Fetch persisted messages error:', err);
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

    fetchPersistedMessages();

    const socket = initializeSocket(project._id);
    console.log('📡 Socket initialized for project:', project._id);

    const messageHandler = (data) => {
  setMessages((prev) => [
    ...prev,
    {
      text: data.message,
      senderId: data.sender?._id || data.sender,
      senderEmail: data.sender?.email || null,
      timestamp: new Date(),
    },
  ]);
};

    socket.on('project-message', messageHandler);
    return () => socket.off('project-message', messageHandler);
  }, [project]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const token = localStorage.getItem('token');
    const messageData = {
      message,
      sender: user._id,
    };

    try {
      // Save to DB
      await axios.post(
        `/projects/${project._id}/user-messages`,
        messageData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('❌ Failed to save message to DB:', err);
    }

    // Send via WebSocket
    sendMessage('project-message', messageData);

    // Update local UI
    setMessages((prev) => [
      ...prev,
      {
    text: message,
    senderId: user._id,
    senderEmail: user.email, // ✅ Add this
    timestamp: new Date(),
  },
    ]);
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
