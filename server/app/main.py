from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from router import user, post

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