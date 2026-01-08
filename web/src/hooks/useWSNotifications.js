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
      try {
        const data = JSON.parse(event.data);

        // ✅ Accept ALL notification types
        if (!data || !data.title || !data.message) return;

        // 🔒 Deduplication
        if (data.id && idsRef.current.has(data.id)) return;

        if (data.id) idsRef.current.add(data.id);

        setNotifications((prev) => [data, ...prev]);
      } catch (err) {
        console.error("WS message parse error:", err);
      }
    };

    ws.onerror = (err) => {
      console.error("WS error:", err);
    };

    ws.onclose = () => {
      console.log("WS closed:", userId);
    };

    return () => ws.close();
  }, [userId]);

  return notifications;
}
