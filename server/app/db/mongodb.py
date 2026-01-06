from pymongo.mongo_client import MongoClient
from config.mongo import MONGO_URL

client = MongoClient(MONGO_URL)

try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

db = client.hackzenith
users_collection = db["users"]
posts_collection = db["posts"]