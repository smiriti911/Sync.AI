// context/AiChatContext.jsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import axios from '../config/axios';
import { useParams } from 'next/navigation';

const AiChatContext = createContext();

export const AiChatProvider = ({ children }) => {
  const { id: projectId } = useParams();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !projectId) return;

      setLoading(true);
      const response = await axios.get(`/projects/${projectId}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Array.isArray(response.data?.messages)) {
        setMessages(response.data.messages);
      } else {
        console.warn('Unexpected API response format:', response.data);
        setMessages([]);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) fetchMessages();
  }, [projectId]);

  return (
    <AiChatContext.Provider
      value={{ messages, setMessages, loading, setLoading, fetchMessages, projectId }}
    >
      {children}
    </AiChatContext.Provider>
  );
};

export const useAiChat = () => useContext(AiChatContext);
