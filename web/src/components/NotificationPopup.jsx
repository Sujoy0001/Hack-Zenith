import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

/**
 * Converts backend links like:
 *   frontend/index/posts/:id
 * to React Router paths:
 *   /index/posts/:id
 */
function normalizePostLink(link) {
  if (!link) return null;
  return link.startsWith("frontend")
    ? link.replace(/^frontend/, "")
    : link;
}

/* ---------------- SYSTEM NOTIFICATIONS ---------------- */
const SYSTEM_NOTIFICATIONS = [
  {
    id: "welcome",
    type: "system",
    title: "Welcome to FindIn",
    message:
      "Welcome to FindIn — report lost items and help others find theirs.",
  },
  {
    id: "release",
    type: "system",
    title: "FindIn v1.0.0 Released",
    message:
      "FindIn v1.0.0 is live. Download the app to upload and find posts easily.",
    post_link: "/download",
  },
];

export default function NotificationPopup({
  open,
  notifications,
  onClose,
  onMarkAllRead,
  onClearAll,
  onDelete,
}) {
  const navigate = useNavigate();

  /* ---------------- MARK ALL READ ON OPEN ---------------- */
  useEffect(() => {
    if (open) {
      onMarkAllRead?.();
    }
  }, [open, onMarkAllRead]);

  if (!open) return null;

  // Merge system + backend notifications
  const allNotifications = [...SYSTEM_NOTIFICATIONS, ...notifications];

  return (
    <div className="absolute top-16 right-6 w-96 bg-white shadow-lg rounded-lg border z-50">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-2 border-b">
        <h3 className="font-semibold">Notifications</h3>
        <button onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      {/* Body */}
      <div className="max-h-96 overflow-y-auto">
        {allNotifications.length === 0 && (
          <p className="p-4 text-sm text-gray-500">No notifications</p>
        )}

        {allNotifications.map((n, index) => (
          <div
            key={n.id || index}
            className="px-4 py-3 border-b hover:bg-gray-50 cursor-pointer"
            onClick={() => {
              if (n.post_link) {
                const path = normalizePostLink(n.post_link);
                if (path) navigate(path);
              }

              // Do not delete system notifications
              if (n.type !== "system") {
                onDelete?.(n.id || index);
              }

              onClose();
            }}
          >
            <h4 className="text-sm font-semibold">{n.title}</h4>
            <p className="text-xs text-gray-600">{n.message}</p>

            {n.type === "match_found" && (
              <span className="text-xs text-green-600 font-medium">
                View matched post
              </span>
            )}

            {n.type === "system" && (
              <span className="text-xs text-blue-600 font-medium">
                System notification
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex justify-between px-4 py-2 border-t text-sm">
        <button onClick={onMarkAllRead}>Mark all read</button>
        <button onClick={onClearAll}>Clear all</button>
      </div>
    </div>
  );
}
