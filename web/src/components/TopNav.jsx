import React, { useState } from "react";
import { Bell, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import BadgeIcon from "./ui/BadgeIcon";
import Profile from "./Profile";
import NotificationPopup from "./NotificationPopup";
import useWSNotifications from "../hooks/useWSNotifications";
import { userID } from "../api/connect";

export default function TopNav() {
  const userId = userID();

  console.log("Current userId:", userId);

  const notifications = useWSNotifications(userId);

  console.log("Notifications received:", notifications);

  const [open, setOpen] = useState(false);
  const [localNotifications, setLocalNotifications] = useState([]);

  // Sync localNotifications with notifications from WS
  React.useEffect(() => {
    setLocalNotifications(notifications);
  }, [notifications]);

  const unreadCount = open ? 0 : localNotifications.length;

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  
  const handleMarkAllRead = () => {
    console.log("Mark all read clicked");
    setLocalNotifications([]);
  };

  // Clear all notifications locally
  const handleClearAll = () => {
    setLocalNotifications([]);
  };

  // Delete single notification by id (or index fallback)
  const handleDelete = (id) => {
    setLocalNotifications((prev) => prev.filter((n) => (n.id || n) !== id));
  };

  return (
    <div className="w-full h-18 sticky top-0 z-20 bg-white border-b border-gray-200 flex items-center justify-end px-4">
      <div className="h-full px-6 flex items-center justify-end gap-4">
        <div
          className="cursor-pointer"
          onClick={() => setOpen((prev) => !prev)}
        >
          <BadgeIcon icon={Bell} count={unreadCount} />
        </div>

        {/* Notification Popup */}
        <NotificationPopup
          open={open}
          notifications={localNotifications}
          onClose={() => setOpen(false)}
          onMarkAllRead={handleMarkAllRead}
          onClearAll={handleClearAll}
          onDelete={handleDelete}
        />

        {/* Messages */}
        <Link to="/index/messages">
          <BadgeIcon icon={MessageCircle} count={0} />
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
