from motor.motor_asyncio import AsyncIOMotorClient
from config.mongo import MONGO_URL

# MONGO_URL = os.getenv("MONGO_URL")
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
