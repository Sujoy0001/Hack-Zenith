import React, { useEffect, useRef, useState } from "react";
import { useUserData } from "../context/useUserData";
import { Mail, Phone, Inbox, Search, Clock, User, MessageSquare, Eye } from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export default function InboxPage() {
  const user = useUserData();

  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isMarkingSeen, setIsMarkingSeen] = useState(false);

  const wsRef = useRef(null);

  /* ================= MARK MESSAGE AS SEEN ================= */
  const markMessageAsSeen = async (messageId) => {
    if (!selected || !user?.uid) return;
    
    setIsMarkingSeen(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/messages/seen/${selected.post_id}?user_uid=${user.uid}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to mark message as seen');
      }

      const result = await response.json();
      console.log('Marked messages as seen:', result);

      // Update local state to reflect seen status
      setMessages(prev => prev.map(msg => {
        if (msg.post_id === selected.post_id && msg.receiver?.uid === user.uid) {
          return { ...msg, status: 'seen', seen_at: new Date().toISOString() };
        }
        return msg;
      }));

      // Update selected message
      if (selected.post_id === selected.post_id) {
        setSelected(prev => ({
          ...prev,
          status: 'seen',
          seen_at: new Date().toISOString()
        }));
      }

    } catch (error) {
      console.error('Error marking message as seen:', error);
    } finally {
      setIsMarkingSeen(false);
    }
  };

  /* ================= LOAD INBOX (RECEIVED ONLY) ================= */
  useEffect(() => {
    if (!user?.uid) return;

    fetch(`${API_BASE_URL}/messages/inbox/${user.uid}`)
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          console.warn("Inbox fetch did not return an array", data);
          return;
        }

        const received = data.filter(
          (msg) => msg?.receiver?.uid === user.uid
        );

        received.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        setMessages(received);
        
        // REMOVED auto-select first message
        // User will manually select which message to open
      })
      .catch((err) => {
        console.error("Inbox fetch error:", err);
      });
  }, [user?.uid]);

  /* ================= WEBSOCKET REAL-TIME ================= */
  useEffect(() => {
    if (!user?.uid) return;

    console.log("Connecting WebSocket for user:", user.uid);
    const ws = new WebSocket(`ws://${API_BASE_URL}/messages/ws/${user.uid}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        console.log("WebSocket message received:", msg);

        if (!msg?._id) return;
        if (msg?.receiver?.uid !== user.uid) return;

        setMessages((prev) => {
          if (prev.some((m) => m._id === msg._id)) return prev;
          return [msg, ...prev];
        });
        
        // REMOVED auto-select for new WebSocket messages
        // User can manually click if they want to see it
        
      } catch (e) {
        console.error("WebSocket message parse error:", e);
      }
    };

    ws.onerror = (e) => {
      console.error("WebSocket error:", e);
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => {
      console.log("Closing WebSocket");
      ws.close();
    };
  }, [user?.uid]);

  /* ================= MARK AS SEEN WHEN VIEWING ================= */
  useEffect(() => {
    if (!selected || !user?.uid) return;
    
    // Only mark as seen if:
    // 1. Current user is the receiver
    // 2. Message is not already seen
    // 3. We're not already in the process of marking
    if (
      selected.receiver?.uid === user.uid &&
      selected.status !== 'seen' &&
      !isMarkingSeen
    ) {
      markMessageAsSeen(selected._id);
    }
  }, [selected, user?.uid]);

  /* ================= HANDLE MESSAGE SELECTION ================= */
  const handleSelectMessage = (msg) => {
    setSelected(msg);
  };

  /* ================= UI ================= */
  return (
    <div className="h-screen flex flex-col top-18 font2">
      {/* HEADER */}
      <header className="border-b border-gray-200 px-8 py-6 bg-white shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-lg">
            <Inbox className="text-blue-600" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Inbox</h1>
            <p className="text-gray-500 text-sm mt-1">
              {messages.length} {messages.length === 1 ? 'message' : 'messages'} •{' '}
              <span className="text-blue-600 font-medium">
                {messages.filter(m => m.status !== "seen" && m.receiver?.uid === user?.uid).length} unread
              </span>
            </p>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden bg-gray-50">
        {/* LEFT MESSAGE LIST */}
        <div className="w-96 bg-white border-r border-gray-200 flex flex-col shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MessageSquare size={16} />
              <span className="font-medium">All Messages</span>
              {messages.length > 0 && (
                <span className="ml-auto bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">
                  {messages.filter(m => m.status !== "seen" && m.receiver?.uid === user?.uid).length} new
                </span>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                  <Mail className="text-gray-400" size={24} />
                </div>
                <p className="text-gray-500 font-medium">No messages yet</p>
                <p className="text-gray-400 text-sm mt-1">Messages you receive will appear here</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isUnread = msg.status !== "seen" && msg.receiver?.uid === user?.uid;
                const isSelected = selected?._id === msg._id;
                const time = new Date(msg.created_at);
                const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return (
                  <div
                    key={msg._id}
                    onClick={() => handleSelectMessage(msg)}
                    className={`px-6 py-4 cursor-pointer transition-all duration-150 border-b border-gray-50
                      ${isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50'}
                      ${isUnread ? 'bg-blue-50/50' : ''}
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                        ${isUnread ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}
                        ${msg.sender?.uid === user?.uid ? 'bg-green-100 text-green-700' : ''}
                      `}>
                        <User size={18} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <p className={`truncate font-medium ${isUnread ? 'text-gray-900' : 'text-gray-700'}`}>
                              {msg.sender?.name || 'Unknown'}
                            </p>
                            {msg.sender?.uid === user?.uid && (
                              <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                                You
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock size={10} />
                            {timeString}
                          </span>
                        </div>
                        
                        <p className={`truncate text-sm mt-1 ${isUnread ? 'text-gray-800 font-medium' : 'text-gray-600'}`}>
                          {msg.message}
                        </p>
                        
                        {isUnread ? (
                          <div className="inline-block mt-2">
                            <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                              New
                            </span>
                          </div>
                        ) : msg.status === 'seen' && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                            <Eye size={10} />
                            <span>Seen</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT MESSAGE DETAIL */}
        <div className="flex-1 bg-white flex flex-col">
          {!selected ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8">
              <div className="bg-gray-100 p-6 rounded-full mb-4">
                <Mail size={32} />
              </div>
              <p className="text-lg font-medium text-gray-500">Select a message</p>
              <p className="text-gray-400 text-sm mt-1">Choose a conversation from the list to view</p>
            </div>
          ) : (
            <>
              {/* MESSAGE HEADER */}
              <div className="border-b border-gray-200 px-8 py-6 bg-white shadow-sm">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full ${
                    selected.sender?.uid === user?.uid ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    <User className={selected.sender?.uid === user?.uid ? 'text-green-700' : 'text-blue-700'} size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold text-gray-800">{selected.sender?.name}</h2>
                        {selected.sender?.uid === user?.uid && (
                          <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded">
                            You sent this
                          </span>
                        )}
                        {selected.status === 'seen' && selected.receiver?.uid === user?.uid && (
                          <span className="flex items-center gap-1 text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            <Eye size={12} />
                            Seen
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(selected.created_at).toLocaleDateString()} •{' '}
                        {new Date(selected.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 mt-2">
                      {selected.sender?.email && (
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <Mail size={14} />
                          <span className="truncate">{selected.sender.email}</span>
                        </p>
                      )}
                      
                      {selected.sender?.phone && (
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <Phone size={14} />
                          <span>{selected.sender.phone}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* MESSAGE CONTENT */}
              <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
                <div className="max-w-3xl mx-auto">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {selected.message}
                      </p>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-gray-100">
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Inbox size={12} />
                          {selected.receiver?.uid === user?.uid ? (
                            <span>Message received</span>
                          ) : (
                            <span>Message sent</span>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          {selected.status === 'seen' && selected.seen_at && (
                            <span className="flex items-center gap-1">
                              <Eye size={12} />
                              Seen at {new Date(selected.seen_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                          <span>
                            {new Date(selected.created_at).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}