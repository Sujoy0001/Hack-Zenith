from fastapi import APIRouter
from model.user import User
from db.mongodb import users_collection
from fastapi.encoders import jsonable_encoder

router = APIRouter()

def get_user_email(user: User) -> str:
    return user.email

@router.post("/add_user")
async def add_user(user: User):
    # Check if user exists by email
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        return {"message": "User already exists"}

    user_dict = jsonable_encoder(user)  # Convert Pydantic model to dict for MongoDB
    await users_collection.insert_one(user_dict)

    return {"message": "User added successfully"}