from motor.motor_asyncio import AsyncIOMotorClient
from config.mongo import MONGO_URL

DATABASE_NAME = "hackzenith"

if not MONGO_URL:
    raise RuntimeError("MONGO_URL environment variable is not set")
else:
    print("MONGO_URL environment variable is set")


client = AsyncIOMotorClient(
    MONGO_URL,
    serverSelectionTimeoutMS=5000,
)

db = client[DATABASE_NAME]

users_collection = db["users"]
posts_collection = db["posts"]
notifications_collection = db["notifications"]
messages_collection = db["messages"]
found_collection = db["found_items"]
lost_collection = db["lost_items"]
matches_collection = db["matches"]
