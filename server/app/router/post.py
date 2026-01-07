from fastapi import APIRouter, File, Form, UploadFile, HTTPException, status
from typing import List, Literal, Optional
from datetime import datetime
from bson import ObjectId
from db.mongodb import posts_collection
import cloudinary.uploader
from model.post import PostCreateModel, PostResponseModel

router = APIRouter(prefix="/posts", tags=["Posts"])

MAX_IMAGES = 5
ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}


# ------------------- Cloudinary -------------------

def upload_to_cloudinary(file: UploadFile) -> str:
    result = cloudinary.uploader.upload(
        file.file,
        folder="posts",
        resource_type="image",
    )
    return result["secure_url"]


# ------------------- CREATE POST -------------------

@router.post("/create", status_code=status.HTTP_201_CREATED)
async def create_post(
    # user
    user_uid: str = Form(...),
    user_email: str = Form(...),
    user_name: str = Form(...),
    user_photo: Optional[str] = Form(None),

    # post
    types: Literal["lost", "found"] = Form(...),
    title: str = Form(...),
    description: str = Form(""),

    # location
    place: str = Form(""),
    area: str = Form(""),

    # tags & images
    tags: str = Form(""),
    images: List[UploadFile] = File(default=[]),
):
    image_urls = []

    if images:
        if len(images) > MAX_IMAGES:
            raise HTTPException(400, "Maximum 5 images allowed")

        for img in images:
            if img.content_type not in ALLOWED_TYPES:
                raise HTTPException(400, "Invalid image type")

            image_urls.append(upload_to_cloudinary(img))

    post_doc = {
        "types": types,
        "title": title.strip(),
        "description": description.strip(),
        "images": image_urls,
        "user": {
            "uid": user_uid,
            "email": user_email,
            "name": user_name,
            "avatar": user_photo,
        },
        "location": {
            "place": place,
            "area": area,
        },
        "tags": [t.strip().lower() for t in tags.split(",") if t.strip()],
        "created_at": datetime.utcnow(),
        "is_solved": False,
    }

    result = await posts_collection.insert_one(post_doc)

    # 🔐 SAFE RESPONSE
    return {
        "_id": str(result.inserted_id),
        "created_at": post_doc["created_at"].isoformat(),
    }


# ------------------- GET ALL POSTS -------------------

@router.get("/get_all")
async def get_all_posts(page: int = 1, limit: int = 10):
    skip = (page - 1) * limit
    posts = []
    cursor = posts_collection.find().sort("created_at", -1).skip(skip).limit(limit)

    async for post in cursor:
        posts.append({
            "id": str(post["_id"]),
            "types": post["types"],
            "title": post["title"],
            "description": post["description"],
            "images": post["images"],
            "user": post["user"],
            "location": post["location"],
            "tags": post["tags"],
            "created_at": post["created_at"].isoformat(),
            "is_solved": post["is_solved"],
        })

    return posts


# ------------------- GET SINGLE POST -------------------

@router.get("/{post_id}")
async def get_post(post_id: str):
    try:
        post = await posts_collection.find_one({"_id": ObjectId(post_id)})
    except Exception:
        raise HTTPException(400, "Invalid post ID")

    if not post:
        raise HTTPException(404, "Post not found")

    return {
        "id": str(post["_id"]),
        "types": post["types"],
        "title": post["title"],
        "description": post["description"],
        "images": post["images"],
        "user": post["user"],
        "location": post["location"],
        "tags": post["tags"],
        "created_at": post["created_at"].isoformat(),
        "is_solved": post["is_solved"],
    }
