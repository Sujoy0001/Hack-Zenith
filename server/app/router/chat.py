from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query, Depends, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId

# Assume you have your MongoDB client setup somewhere accessible
from db.mongodb import messages_collection  # Your messages collection

router = APIRouter(prefix="/messages", tags=["Messages"])

# Pydantic models

class UserInfo(BaseModel):
    uid: str
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None

class MessageCreate(BaseModel):
    post_id: str
    message: str
    sender: UserInfo
    receiver: UserInfo

class MessageDB(MessageCreate):
    status: str
    created_at: datetime
    delivered_at: Optional[datetime] = None
    seen_at: Optional[datetime] = None

class MessageResponse(BaseModel):
    id: str = Field(..., alias="_id")
    post_id: str
    message: str
    sender: UserInfo
    receiver: UserInfo
    status: str
    created_at: datetime
    delivered_at: Optional[datetime] = None
    seen_at: Optional[datetime] = None


# ----------------------------
# WebSocket Connection Manager
# ----------------------------

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, uid: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[uid] = websocket

    def disconnect(self, uid: str):
        if uid in self.active_connections:
            self.active_connections.pop(uid)

    async def send_personal_message(self, uid: str, message: dict):
        websocket = self.active_connections.get(uid)
        if websocket:
            await websocket.send_json(message)

manager = ConnectionManager()

# ----------------------------
# WebSocket Endpoint
# ----------------------------

@router.websocket("/ws/{uid}")
async def websocket_endpoint(websocket: WebSocket, uid: str):
    await manager.connect(uid, websocket)
    try:
        while True:
            # Keep connection alive, receive pings or messages (ignored here)
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(uid)


# ----------------------------
# Send a message
# ----------------------------

@router.post("", status_code=201)
async def send_message(payload: MessageCreate):
    data = payload.dict()
    data.update({
        "status": "sent",
        "created_at": datetime.utcnow(),
        "delivered_at": None,
        "seen_at": None
    })

    result = await messages_collection.insert_one(data)

    # Send real-time notification to receiver
    await manager.send_personal_message(
        payload.receiver.uid,
        {
            "type": "new_message",
            "post_id": payload.post_id,
            "message": payload.message,
            "sender": payload.sender.dict(),
            "created_at": data["created_at"].isoformat(),
        }
    )

    return {"success": True, "message_id": str(result.inserted_id)}


# ----------------------------
# Mark messages as seen for a post and user
# ----------------------------

@router.patch("/seen/{post_id}")
async def mark_seen(post_id: str, user_uid: str = Query(...)):
    update_result = await messages_collection.update_many(
        {
            "post_id": post_id,
            "receiver.uid": user_uid,
            "status": {"$ne": "seen"}
        },
        {
            "$set": {
                "status": "seen",
                "seen_at": datetime.utcnow()
            }
        }
    )

    # Optionally, notify sender that messages are seen - implementation depends on your app design
    # For now, just return success

    return {"success": True, "updated_count": update_result.modified_count}


# ----------------------------
# Get inbox list (latest message per post)
# ----------------------------

@router.get("/inbox/{uid}", response_model=List[MessageResponse])
async def get_inbox(uid: str):
    pipeline = [
        {
            "$match": {
                "$or": [
                    {"sender.uid": uid},
                    {"receiver.uid": uid}
                ]
            }
        },
        {"$sort": {"created_at": -1}},
        {
            "$group": {
                "_id": "$post_id",
                "last_message": {"$first": "$$ROOT"}
            }
        },
        {"$replaceRoot": {"newRoot": "$last_message"}}
    ]

    cursor = messages_collection.aggregate(pipeline)
    messages = []
    async for doc in cursor:
        # Convert ObjectId to string
        doc["_id"] = str(doc["_id"])
        messages.append(doc)

    return messages


# ----------------------------
# Get unread message count for user
# ----------------------------

@router.get("/unread-count/{uid}")
async def get_unread_count(uid: str):
    count = await messages_collection.count_documents({
        "receiver.uid": uid,
        "status": {"$ne": "seen"}
    })

    return {"count": count}

# Add this endpoint to your backend router

@router.get("")
async def get_messages(post_id: str = Query(...), user_uid: str = Query(...)):
    """
    Get all messages for a specific post and user.
    """
    cursor = messages_collection.find({
        "post_id": post_id,
        "$or": [
            {"sender.uid": user_uid},
            {"receiver.uid": user_uid}
        ]
    }).sort("created_at", 1)
    
    messages = []
    async for doc in cursor:
        # Convert ObjectId to string
        doc["_id"] = str(doc["_id"])
        messages.append(doc)
    
    return {"messages": messages}