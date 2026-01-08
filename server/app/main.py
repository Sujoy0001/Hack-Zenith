from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from router import user, post, ws, chat
import asyncio
from ai.brack import break_posts_collection, monitor_found_collection

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
app.include_router(chat.router)

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(start_background())


async def start_background():
    await asyncio.sleep(30)
    await break_posts_collection()
    asyncio.create_task(monitor_found_collection())
