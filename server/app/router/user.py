from fastapi import APIRouter
from model.user import User
from db.mongodb import users_collection
from router.ws import manager

router = APIRouter()

@router.post("/user")
async def create_user(user: User):
    existing_user = await users_collection.find_one(
        {"email": user.email}
    )

    if existing_user:
        manager.send(
            user.uid,
            {
                "type": "notification",
                "title": "Welcome",
                "message": "Welcome to FindIn! Start exploring now.",
            }
        )
        return {
            "status": "exists",
            "user": {
                "id": str(existing_user["_id"]),
                "email": existing_user["email"],
                "name": existing_user.get("name"),
            },
        }
        

    # INSERT USER
    result = await users_collection.insert_one(user.dict())
    user_id = str(result.inserted_id)  # ✅ SINGLE SOURCE OF TRUTH

    # SEND WELCOME NOTIFICATION (RELIABLE)
    await manager.send(
        user_id,
        {
            "type": "notification",
            "title": "Welcome",
            "message": "Welcome to FindIn! Start exploring now.",
        }
    )

    return {
        "status": "created",
        "user": {
            "id": user_id,
            "email": user.email,
            "name": user.name,
        },
    }
