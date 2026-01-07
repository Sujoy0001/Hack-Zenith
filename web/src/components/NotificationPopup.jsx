import React from "react";
import { Bell, Inbox } from "lucide-react"; // Optional: install lucide-react for icons

export default function NotificationPopup({
  open,
  notifications = [],
  onClose,
  onMarkAllRead,
  onClearAll,
  onDelete, // receives notification id
  onNotificationClick, // optional: if you want to handle clicking the notification itself
}) {
  if (!open) return null;

  const hasNotifications = notifications.length > 0;

  return (
    <div
      className="absolute right-10 top-16 w-120 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
      onMouseLeave={onClose}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-gray-700" />
          <h3 className="font-semibold text-lg text-gray-900">Notifications</h3>
          {hasNotifications && notifications.some(n => !n.read) && (
            <span className="px-2 py-0.5 text-xs font-medium text-white bg-blue-600 rounded-full">
              {notifications.filter(n => !n.read).length}
            </span>
          )}
        </div>

        {hasNotifications && (
          <div className="flex items-center gap-4 text-sm">
            <button
              onClick={onMarkAllRead}
              className="text-blue-600 hover:text-blue-700 font-medium transition"
            >
              Mark all read
            </button>
            <button
              onClick={onClearAll}
              className="text-red-600 hover:text-red-700 font-medium transition"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Notification List */}
      <div className="max-h-96 overflow-y-auto">
        {!hasNotifications ? (
          <div className="py-12 px-6 text-center">
            <Inbox className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-sm text-gray-500">You're all caught up!</p>
            <p className="text-xs text-gray-400 mt-1">No notifications right now.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`px-5 py-4 flex items-start gap-3 hover:bg-gray-50 transition cursor-pointer group ${
                  !notification.read ? "bg-blue-50/30" : ""
                }`}
                onClick={() => onNotificationClick?.(notification)}
              >
                {/* Unread indicator */}
                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0" />
                )}

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium text-gray-900 line-clamp-1 ${
                      !notification.read ? "font-semibold" : ""
                    }`}
                  >
                    {notification.title}
                  </p>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {notification.message}
                  </p>
                  {notification.timestamp && (
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(notification.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                </div>

                {/* Delete button - appears on hover */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering notification click
                    onDelete(notification.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 transition p-1"
                  aria-label="Delete notification"
                  title="Delete"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Optional footer */}
      {hasNotifications && (
        <div className="px-5 py-3 text-center text-xs text-gray-500 border-t border-gray-200">
          {notifications.length} notification{notifications.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}