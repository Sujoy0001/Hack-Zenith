from fastapi import APIRouter
from db.mongodb import messages_collection

router = APIRouter()

@router.get("/chats/{user_id}")
async def get_user_chats(user_id: str):
    chats = []
    cursor = messages_collection.find(
        {"$or": [{"sender_id": user_id}, {"receiver_id": user_id}]}
    ).sort("created_at", -1)

    async for message in cursor:
        chats.append({
            "id": str(message["_id"]),
            "sender_id": message["sender_id"],
            "receiver_id": message["receiver_id"],
            "content": message["content"],
            "created_at": message["created_at"].isoformat(),
        })

    return chats