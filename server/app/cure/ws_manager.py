from fastapi import WebSocket
from starlette.websockets import WebSocketDisconnect
from typing import Dict
from datetime import datetime
from db.mongodb import notifications_collection

class WSManager:
    def __init__(self):
        self.active: Dict[str, WebSocket] = {}

    async def connect(self, user_id: str, websocket: WebSocket):
        await websocket.accept()
        self.active[user_id] = websocket

        # SEND UNREAD NOTIFICATIONS ON CONNECT
        unread_notifications = await notifications_collection.find(
            {"user_id": user_id, "read": False}
        ).sort("created_at", -1).to_list(20)

        try:
            for n in unread_notifications:
                await websocket.send_json({
                    "id": str(n["_id"]),
                    "type": n.get("type", "notification"),
                    "title": n["title"],
                    "message": n["message"],
                    "created_at": n["created_at"].isoformat(),
                })
        except WebSocketDisconnect:
            print(f"WebSocketDisconnect while sending unread notifications to user {user_id}")
            self.disconnect(user_id)
        except Exception as e:
            print(f"Error sending unread notifications to user {user_id}: {e}")
            self.disconnect(user_id)

    def disconnect(self, user_id: str):
        self.active.pop(user_id, None)

    async def send(self, user_id: str, payload: dict):
        # STORE IN DB (RELIABILITY)
        await notifications_collection.insert_one({
            "user_id": user_id,
            "title": payload["title"],
            "message": payload["message"],
            "type": payload.get("type", "notification"),
            "read": False,
            "created_at": datetime.utcnow(),
        })

        # PUSH IF USER IS ONLINE
        ws = self.active.get(user_id)
        if ws:
            try:
                await ws.send_json(payload)
            except WebSocketDisconnect:
                print(f"WebSocketDisconnect while sending to user {user_id}")
                self.disconnect(user_id)
            except Exception as e:
                print(f"Unexpected error sending to user {user_id}: {e}")
                self.disconnect(user_id)
