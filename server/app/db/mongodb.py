from config import MONGO_URL
from motor.motor_asyncio import AsyncIOMotorClient

client = AsyncIOMotorClient(MONGO_URL)
db = client.hackzenith
user_collection = db.users
exdate_collection = db.exdate