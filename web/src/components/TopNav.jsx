import React, { useEffect, useState } from "react";
import { Bell, MessageCircle } from "lucide-react";
import CountButton from "./ui/CountButton";
import { Link } from "react-router-dom";
import BadgeIcon from "./ui/BadgeIcon";
import Profile from "./Profile";

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="w-full h-18 sticky top-0 z-50 bg-white border-b border-gray-200 flex items-center justify-end px-4">
      <div className="h-full px-6 flex items-center justify-end gap-4">

        <Link to='/index/notifications'>
          <BadgeIcon icon={Bell} count={5} />
        </Link>

        <Link to='/index/massages'>
          <BadgeIcon icon={MessageCircle} count={10} />
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
