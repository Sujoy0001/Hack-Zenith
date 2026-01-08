import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

export default function NotificationPopup({
  open,
  notifications,
  onClose,
  onMarkAllRead,
  onClearAll,
  onDelete,
}) {
  const navigate = useNavigate();

  if (!open) return null;

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
        {notifications.length === 0 && (
          <p className="p-4 text-sm text-gray-500">No notifications</p>
        )}

        {notifications.map((n, index) => (
          <div
            key={n.id || index}
            className="px-4 py-3 border-b hover:bg-gray-50 cursor-pointer"
            onClick={() => {
              if (n.post_link) {
                const path = normalizePostLink(n.post_link);
                if (path) {
                  navigate(path);
                }
              }

              onDelete(n.id || index);
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
