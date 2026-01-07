from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from router import user, post, ws
from brack import break_posts_collection
from ai import match_lost_found
from db.mongodb import found_collection
import asyncio

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/get/notifications")
async def get_notifications():
    return {"notifications": 5, "messages": 1}

app.include_router(user.router, prefix="/test")
app.include_router(post.router)
app.include_router(ws.router)


async def monitor_found_collection():
    previous_count = await found_collection.count_documents({})

    while True:
        await asyncio.sleep(30)

        current_count = await found_collection.count_documents({})

        if current_count > previous_count:
            increase = current_count - previous_count
            print(f"Found collection increased by {increase}")

            await match_lost_found()
            await break_posts_collection()

            previous_count = current_count
        else:
            print("No new found posts")