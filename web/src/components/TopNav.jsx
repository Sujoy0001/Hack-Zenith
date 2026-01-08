import React, { useState, useMemo } from "react";
import { Bell, MessageCircle, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import BadgeIcon from "./ui/BadgeIcon";
import Profile from "./Profile";

/* ---------------- SYSTEM NOTIFICATIONS ---------------- */
const SYSTEM_NOTIFICATIONS = [
  {
    id: "sys-welcome",
    type: "system",
    title: "Welcome to FindIn",
    message:
      "Welcome to FindIn — report lost items and help others find theirs.",
    read: false,
  },
  {
    id: "sys-release",
    type: "system",
    title: "FindIn v1.0.0 Released",
    message:
      "FindIn v1.0.0 is live. Download the app to upload and find posts easily.",
    post_link: "/index/download",
    read: false,
  },
];

/* ---------------- LINK NORMALIZER ---------------- */
function normalizePostLink(link) {
  if (!link) return null;
  return link.startsWith("frontend")
    ? link.replace(/^frontend/, "")
    : link;
}

export default function TopNav() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(SYSTEM_NOTIFICATIONS);

  /* ---------------- UNREAD COUNT ---------------- */
  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  /* ---------------- OPEN POPUP ---------------- */
  const handleOpenNotifications = () => {
    setOpen((prev) => !prev);

    // Mark all notifications as read immediately
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  };

  /* ---------------- DELETE (NON-SYSTEM ONLY) ---------------- */
  const handleDelete = (id) => {
    setNotifications((prev) =>
      prev.filter((n) => n.id !== id || n.type === "system")
    );
  };

  const handleLogout = () => {
    setOpen(false);
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="w-full h-18 sticky top-0 z-20 bg-white border-b border-gray-200 flex items-center justify-end px-4 relative">
      <div className="h-full px-6 flex items-center gap-4">

        {/* Notifications */}
        <div className="cursor-pointer" onClick={handleOpenNotifications}>
          <BadgeIcon icon={Bell} count={unreadCount} />
        </div>

        {/* POPUP */}
        {open && (
          <div className="absolute top-18 font2 right-6 w-108 bg-white border-gray-300 shadow-lg rounded-lg border z-50">
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-2 border-gray-300 border-b">
              <h3 className="font-semibold text-xl">Notifications</h3>
              <button onClick={() => setOpen(false)} className="cursor-pointer">
                <X size={22} />
              </button>
            </div>

            {/* Body */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 && (
                <p className="p-4 text-sm text-gray-500">
                  No notifications
                </p>
              )}

              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="px-4 py-3 border-b border-gray-300 cursor-pointer"
                  onClick={() => {
                    if (n.post_link) {
                      const path = normalizePostLink(n.post_link);
                      if (path) navigate(path);
                    }

                    if (n.type !== "system") {
                      handleDelete(n.id);
                    }

                    setOpen(false);
                  }}
                >
                  <h4 className="text-md font-semibold">{n.title}</h4>
                  <p className="text-md mt-2 mb-4 text-gray-600">{n.message}</p>

                  {n.type === "system" && (
                    <span className="text-md text-blue-600 font-medium">
                      System notification
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

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
