import { useEffect, useRef, useState } from "react";
import { FaArrowUp, FaLink } from "react-icons/fa6";
import axios from "../../config/axios";

// Import router from next/navigation if using app directory
import { useRouter } from 'next/navigation';  // or 'next/navigation' if app dir

export default function InputBox() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
  }, [input]);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No auth token found.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(
        '/projects/create-with-message',
        { message: input.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Project created:', res.data);
      setInput('');

      // Redirect to dynamic project page
      router.push(`/userproject/${res.data._id}`);

    } catch (err) {
      if (err.response) {
        console.log('Error creating project:', err.response.data);
      } else {
        console.log('Error submitting project:', err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="mt-6 w-full max-w-2xl bg-neutral-900/60 rounded-2xl p-4 border-2 border-neutral-800/90">
      <textarea
        ref={textareaRef}
        placeholder="So, what are we building today?"
        className="w-full min-h-[56px] max-h-[200px] bg-transparent text-white placeholder:text-neutral-400 px-4 py-3 rounded-lg text-sm focus:outline-none resize-none overflow-y-auto scrollbar-hidden"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
      />

      <div className="flex justify-between items-center mt-2">
        <button className="hover:opacity-80 transition" disabled={isLoading}>
          <FaLink className="text-2xl" />
        </button>
        <button
          className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
            !input.trim() || isLoading
              ? "bg-neutral-400 text-neutral-900 cursor-not-allowed"
              : "bg-white text-black hover:opacity-90"
          }`}
          disabled={!input.trim() || isLoading}
          onClick={handleSubmit}
        >
          <FaArrowUp />
        </button>
      </div>
    </div>
  );
}
