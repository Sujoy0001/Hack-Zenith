import { useEffect, useRef, useState } from "react";

export default function useWSNotifications(userId) {
  const [notifications, setNotifications] = useState([]);
  const idsRef = useRef(new Set());

  useEffect(() => {
    if (!userId) return;

    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/${userId}`);

    ws.onopen = () => {
      console.log("WS connected:", userId);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type !== "notification") return;

      // 🔒 Deduplication
      if (data.id && idsRef.current.has(data.id)) return;

      if (data.id) idsRef.current.add(data.id);

      setNotifications((prev) => [data, ...prev]);
    };

    ws.onerror = (err) => {
      console.error("WS error", err);
    };

    ws.onclose = () => {
      console.log("WS closed:", userId);
    };

    return () => ws.close();
  }, [userId]);

  return notifications;
}
