import React, { useEffect, useState } from "react";
import { Bell, MessageCircle } from "lucide-react";
import CountButton from "./ui/CountButton";
import { Link } from "react-router-dom";

export default function TopNav() {
  const [notifications, setNotifications] = useState(10);
  const [messages, setMessages] = useState(17);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/topnav-counts", {
          credentials: "include",
        });
        const data = await res.json();

        setNotifications(data.notifications ?? 0);
        setMessages(data.messages ?? 0);
      } catch (error) {
        console.error("Failed to load topnav counts", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="w-full h-16 sticky top-0 z-50 bg-white shadow">
      <div className="h-full px-6 flex items-center justify-end gap-4">

        <Link to='/index/notifications'>
          <CountButton
            icon={Bell}
            text="Notifications"
            count={loading ? 0 : notifications}
            ariaLabel="Notifications"
            onClick={() => console.log("Open notifications")}
          />
        </Link>

        <Link to='/index/massages'>
          <CountButton
            icon={MessageCircle}
            count={loading ? 0 : messages}
            ariaLabel="Messages"
            text="Messages"
            onClick={() => console.log("Open chat")}
          />
        </Link>
      </div>
    </div>
  );
}
