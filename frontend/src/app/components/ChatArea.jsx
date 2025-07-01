'use client';

import React, { useState, useRef, useContext, useEffect } from "react";
import { IoPeopleSharp } from "react-icons/io5";
import { RiSendPlaneFill } from "react-icons/ri";
import { IoPersonAddSharp } from "react-icons/io5";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import SidePanel from "./UserSidePanel";
import AddCollaborator from "./AddCollaborator";
import { useSingleProject } from "../../context/singleProject.context";
import { UserContext } from "../../context/user.context";

const ChatArea = ({ onClose }) => {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isAddCollaboratorOpen, setIsAddCollaboratorOpen] = useState(false);
  const { message, setMessage, handleSendMessage, messages, project, users } =
    useSingleProject();
  const { user } = useContext(UserContext);
  const messageBoxRef = useRef(null);
  const textAreaRef = useRef(null);

  const handleAddCollaborator = (userIds) => {
    setIsAddCollaboratorOpen(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  };

  const adjustTextareaHeight = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${Math.min(
        textAreaRef.current.scrollHeight,
        150
      )}px`;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  useEffect(() => {
    const input = textAreaRef.current;
    const handleFocus = () => setTimeout(scrollToBottom, 300);
    input?.addEventListener("focus", handleFocus);
    return () => input?.removeEventListener("focus", handleFocus);
  }, []);

  return (
    <main className="h-[100dvh] flex flex-col items-center mx-2">
      <SidePanel
        isOpen={isSidePanelOpen}
        togglePanel={() => setIsSidePanelOpen(!isSidePanelOpen)}
      />
      <AddCollaborator
        isOpen={isAddCollaboratorOpen}
        togglePanel={() => setIsAddCollaboratorOpen(false)}
        onSelect={handleAddCollaborator}
      />

      <section className="w-[400px] max-w-full flex flex-col flex-1  my-8 rounded-2xl border border-neutral-700 shadow-lg backdrop-blur-lg bg-neutral-950 overflow-hidden">
        <header className="flex justify-between items-center bg-neutral-900/50 h-11 px-1 rounded-t-2xl">
          <div className="flex items-center">
            <button
              className="p-2 rounded-full hover:bg-neutral-800/70 transition"
              onClick={onClose}
            >
              <MdOutlineKeyboardArrowLeft className="text-white/80 text-2xl" />
            </button>
            <button
              className="p-1 rounded-full cursor-pointer"
              onClick={() => setIsSidePanelOpen(true)}
            >
              <IoPeopleSharp className="text-indigo-300 text-3xl" />
            </button>
          </div>
          <button
            className="p-3 rounded-full items-center flex justify-center"
            onClick={() => setIsAddCollaboratorOpen(true)}
          >
            <IoPersonAddSharp className="text-emerald-300 text-2xl cursor-pointer" />
          </button>
        </header>

        <div
          ref={messageBoxRef}
          className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-hidden"
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.senderId === user?._id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`${
                  msg.senderId === user?._id
                    ? "bg-gradient-to-br from-indigo-400/40 to-indigo-200/10"
                    : "bg-gradient-to-br from-emerald-400/40 to-emerald-200/10"
                } text-white backdrop-blur-md border border-white/10
                px-4 py-3 rounded-2xl shadow-xl max-w-[280px] sm:max-w-[70%] break-words transition-all duration-300`}
              >
                <small className="text-xs font-semibold text-white/100">
                  {msg.senderId === user?._id
                    ? "You"
                    : msg.senderEmail ||
                      users.find((u) => u._id === msg.senderId)?.email ||
                      "Unknown"}
                  :
                </small>
                <p className="text-sm break-words">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-end px-4 py-3 gap-2 bg-neutral-950 rounded-b-2xl">
          <textarea
            ref={textAreaRef}
            placeholder="Send a message..."
            className="flex-1 bg-neutral-700 text-white px-4 py-3 rounded-lg text-sm focus:outline-none resize-none max-h-[150px] overflow-y-auto scrollbar-hidden"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            rows={1}
            style={{
              minHeight: "44px",
              lineHeight: "1.25rem",
            }}
          />
          <button
            className="p-1 text-emerald-300 hover:text-indigo-300 transition mb-1"
            onClick={handleSendMessage}
          >
            <RiSendPlaneFill className="text-3xl" />
          </button>
        </div>
      </section>
    </main>
  );
};

export default ChatArea;
