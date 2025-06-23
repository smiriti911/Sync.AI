'use client';

import { useEffect, useRef, useState } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import Markdown from 'markdown-to-jsx';
import axios from '../../config/axios';
import { useAiChat } from '@/context/AiChatContext';
import PROMPTS from './Prompt';

export default function AIChatView({ onCodeGenerated, setIsGenerating }) {
  const { messages, setMessages, loading, setLoading, fetchMessages, projectId } = useAiChat();

  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [inputMessage]);

  useEffect(() => {
    if (!initializedRef.current && messages.length > 1) {
      initializedRef.current = true;

      const lastAssistant = [...messages].reverse().find((m) => m.role === 'assistant');
      const lastUserBeforeAssistant = [...messages]
        .reverse()
        .find((m, i, arr) => m.role === 'user' && arr[i - 1]?.role === 'assistant');

      if (lastAssistant && lastUserBeforeAssistant) {
        console.log("🌀 Regenerating code from last user message on load:", lastUserBeforeAssistant.content);
        setIsGenerating?.(true); // ✅ Trigger loading overlay
        generateCode(lastUserBeforeAssistant.content);
      }
    }
  }, [messages, projectId]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      _id: `temp-${Date.now()}`,
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `/projects/${projectId}/messages`,
        { message: userMessage.content },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { messages: updatedMessages, userMessage: uMsg, aiResponse } = response.data;

      const normalize = (msg) => ({
        ...msg,
        timestamp: msg.timestamp || new Date().toISOString(),
      });

      if (Array.isArray(updatedMessages)) {
        setMessages(updatedMessages.map(normalize));
      } else if (uMsg && aiResponse) {
        const newMessages = [
          ...messages.filter((m) => m._id !== userMessage._id),
          normalize(uMsg),
          normalize(aiResponse),
        ];
        setMessages(newMessages);

        // ✅ Trigger loading before code generation
        setIsGenerating?.(true);
        console.log("⚡ Code generation triggered from chat response:", normalize(uMsg).content);
        await generateCode(normalize(uMsg).content);
      } else {
        console.warn('Unexpected API response format after sending message:', response.data);
        fetchMessages();
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setLoading(false);
    }
  };


//working function

  // const generateCode = async (userMessageText) => {
  //   if (!userMessageText || !projectId) return;

  //   const token = localStorage.getItem('token');
  //   if (!token) return;

  //   try {
  //     console.log("🔧 Starting code generation with prompt:", userMessageText);
  //     const response = await axios.post(
  //       `/projects/${projectId}/generate-code`,
  //       {
  //         message: `${userMessageText} ${PROMPTS.CODE_GEN_PROMPT}`,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           'Content-Type': 'application/json',
  //         },
  //       }
  //     );

  //     const generatedFilesArray = (response.data?.files || []).filter(
  //       (file) =>
  //         file?.name &&
  //         typeof file.content === 'string' &&
  //         file.content.trim() !== ''
  //     );

  //     const generatedFiles = Object.fromEntries(
  //       generatedFilesArray.map((f) => [f.name, { code: f.content }])
  //     );

  //     console.log("✅ Code generation completed. Files:", Object.keys(generatedFiles));

  //     if (onCodeGenerated && typeof onCodeGenerated === 'function') {
  //       onCodeGenerated(generatedFiles);
  //     }
  //   } catch (error) {
  //     console.error("🔥 Code generation failed:", error);
  //     if (error.response) console.error("🧾 Details:", error.response.data);
  //   }
  // };

const generateCode = async (userMessageText) => {
  if (!userMessageText || !projectId) return;

  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    console.log("🔧 Starting code generation with prompt:", userMessageText);
    
    const response = await axios.post(
      `/projects/${projectId}/generate-code`,
      {
        message: `${userMessageText} ${PROMPTS.CODE_GEN_PROMPT}`,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const version = response.data?.version;
    const generatedFilesArray = Array.isArray(response.data?.files)
      ? response.data.files.filter(
          (file) =>
            file?.name &&
            typeof file.content === 'string' &&
            file.content.trim() !== ''
        )
      : [];

    const generatedFiles = Object.fromEntries(
      generatedFilesArray.map((f) => [f.name, { code: f.content }])
    );

    console.log(`✅ Code generation completed (version ${version}). Files:`, Object.keys(generatedFiles));

    if (onCodeGenerated && typeof onCodeGenerated === 'function') {
      onCodeGenerated(generatedFiles, version); // Optional: version can be used in UI
    }
  } catch (error) {
    console.error("🔥 Code generation failed:", error);
    if (error.response) console.error("🧾 Details:", error.response.data);
  }
};


  const renderMessageContent = (content) => <Markdown>{content}</Markdown>;

  // 🧠 UI remains untouched
  return (
    <div className="flex flex-col h-166 max-w-lg lg:max-w-xl mx-auto bg-neutral-900">
      <div className="flex-1 overflow-y-auto p-2 scrollbar-hidden space-y-2">
        {loading && messages.length === 0 ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg._id || `msg-${Math.random()}`}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] px-3 py-2 rounded-lg ${
                  msg.role !== 'user' ? 'prose prose-invert prose-sm max-w-none' : ''
                } leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-neutral-800 text-white rounded-tr-none'
                    : 'bg-neutral-900 text-white/80 rounded-tl-none'
                }`}
              >
                {msg.role === 'user' ? msg.content : renderMessageContent(msg.content)}
              </div>
              <div
                className={`flex items-center gap-1 mt-0.5 text-xs text-gray-500 ${
                  msg.role === 'user' ? 'ml-auto' : 'mr-auto'
                }`}
              >
                {msg.role !== 'user' && <span className="font-medium">Sync</span>}
                <span>
                  {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No messages yet</p>
        )}

        {loading && messages.length > 0 && (
          <div className="flex items-start">
            <div className="max-w-[85%] px-3 py-2 rounded-lg bg-neutral-900 text-white/80">
              <div className="flex space-x-1">
                <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="sticky bottom-0 z-20 bg-neutral-800 backdrop-blur-sm rounded-2xl border border-neutral-700 p-3 m-3">
        <div className="flex flex-col">
          <textarea
            ref={textareaRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask Sync..."
            className="w-full bg-transparent text-white placeholder-gray-400 rounded-lg p-3 resize-none focus:outline-none overflow-y-auto scrollbar-hidden"
            style={{ minHeight: '60px', maxHeight: '200px' }}
            rows={2}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={loading}
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handleSendMessage}
              disabled={loading || !inputMessage.trim()}
              className={`p-2 rounded-full bg-neutral-200 text-neutral-900 transition-colors mb-1 flex items-center justify-center w-9 h-9 ${
                loading || !inputMessage.trim()
                  ? 'opacity-80 cursor-not-allowed'
                  : 'hover:bg-neutral-400'
              }`}
            >
              {loading ? (
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
              ) : (
                <FaArrowUp size={14} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
