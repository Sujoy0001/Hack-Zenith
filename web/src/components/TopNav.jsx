import React, { useEffect, useState, useCallback } from "react";
import { Bell, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import BadgeIcon from "./ui/BadgeIcon";
import Profile from "./Profile";
import NotificationPopup from "./NotificationPopup";
import useWSNotifications from "../hooks/useWSNotifications";
import { userID } from "../api/connect";

export default function TopNav() {
  const userId = userID();

  // Always normalize to array
  const wsNotifications = useWSNotifications(userId) || [];
  console.log("WS Notifications:", wsNotifications);

  const [open, setOpen] = useState(false);
  const [localNotifications, setLocalNotifications] = useState([]);

  /**
   * Merge incoming WS notifications safely
   * - Normalize IDs
   * - Prevent duplicates
   * - Preserve read state
   */
  const mergeNotifications = useCallback((incoming) => {
    setLocalNotifications((prev) => {
      const existingIds = new Set(prev.map((n) => n.id));

      const normalized = incoming
        .filter(Boolean)
        .map((n) => ({
          ...n,
          id: n.id || crypto.randomUUID(),
          read: n.read ?? false,
        }))
        .filter((n) => !existingIds.has(n.id));

      return normalized.length ? [...normalized, ...prev] : prev;
    });
  }, []);

  useEffect(() => {
    if (!Array.isArray(wsNotifications) || wsNotifications.length === 0) return;
    mergeNotifications(wsNotifications);
  }, [wsNotifications, mergeNotifications]);

  const unreadCount = localNotifications.filter(n => !n.read).length;

  const handleLogout = () => {
    setOpen(false);
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleMarkAllRead = () => {
    setLocalNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  };

  const handleClearAll = () => {
    setLocalNotifications([]);
  };

  const handleDelete = (id) => {
    setLocalNotifications((prev) =>
      prev.filter((n) => n.id !== id)
    );
  };

  return (
    <div className="w-full h-18 sticky top-0 z-20 bg-white border-b border-gray-200 flex items-center justify-end px-4">
      <div className="h-full px-6 flex items-center gap-4">

        {/* Notifications */}
        <div
          className="cursor-pointer"
          onClick={() => setOpen((prev) => !prev)}
        >
          <BadgeIcon icon={Bell} count={unreadCount} />
        </div>

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

        {/* Profile */}
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
