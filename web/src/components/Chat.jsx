import React, { useState, useEffect, useRef } from "react";
import { X, Send, Phone } from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

export default function Chat({ open, onClose, post, sender }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (open && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [open]);

  const handleSend = async () => {
    if (!message.trim() || loading) return;

    try {
      setLoading(true);

      const payload = {
        post_id: post._id || post.id,
        message: message.trim(),
        sender: {
          uid: sender.uid,
          name: sender.name,
          email: sender.email,
          phone: sender.phone,
        },
        receiver: {
          uid: post.user.uid,
          name: post.user.name,
          email: post.user.email,
        },
      };

      const res = await fetch(`${API_BASE_URL}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      setMessage("");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed font2 inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-xl">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-400">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-bold text-lg text-gray-800">
                Send a message
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                To: <span className="font-medium">{post.user?.name}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-700 hover:text-black cursor-pointer p-1 rounded-full hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          <div className="mb-4">
            <p className="text-sm text-gray-700 mb-2">
              Regarding: <span className="font-medium">{post.title}</span>
            </p>
          </div>
          
          <div className="mb-4">
            <textarea
              ref={textareaRef}
              rows={5}
              placeholder={`Hi ${post.user?.name}, I'm interested in your post ${post.title}..`}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500">
                Press Enter to send, Shift+Enter for new line
              </span>
              <span className={`text-sm ${message.length > 480 ? 'text-red-500' : 'text-gray-500'}`}>
                {message.length}/500
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t bg-gray-50 rounded-b-xl">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 cursor-pointer py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={!message.trim() || loading}
              className={`flex-1 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 ${
                !message.trim() || loading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending
                </>
              ) : (
                <>
                  <Send size={18} />
                  Send
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}