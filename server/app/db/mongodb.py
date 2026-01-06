# db/mongodb.py
from motor.motor_asyncio import AsyncIOMotorClient
import os

MONGO_URL = os.getenv("MONGO_URL")
DATABASE_NAME = "hackzenith"

# Create AsyncIOMotorClient
client = AsyncIOMotorClient(MONGO_URL)
# Get database
db = client[DATABASE_NAME]

# Get collections
users_collection = db["users"]
posts_collection = db["posts"]

try:
    client.admin.command('ping')
    print("Successfully connected to MongoDB with Motor!")
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")