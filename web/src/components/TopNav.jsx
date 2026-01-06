import React, { useEffect, useState } from "react";
import { Bell, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import BadgeIcon from "./ui/BadgeIcon";
import Profile from "./Profile";

export default function TopNav() {
  const [notifications, setNotifications] = useState(0);
  const [messages, setMessages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/get/notifications", {
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="w-full h-16 sticky top-0 z-20 bg-white border-b border-gray-200 flex items-center justify-end px-4">
      <div className="h-full px-6 flex items-center justify-end gap-4">
        <Link to="/index/notifications">
          <BadgeIcon icon={Bell} count={loading ? null : notifications} />
        </Link>

        <Link to="/index/messages">
          <BadgeIcon icon={MessageCircle} count={loading ? null : messages} />
        </Link>

        <Profile
          username="Sujoy Garai"
          email="sujoygarai89@gmail.com"
          image="https://i.pravatar.cc/150"
          onLogout={handleLogout}
        />
      </div>
    </div>
  );
}
