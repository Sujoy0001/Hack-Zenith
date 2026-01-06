from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from typing import List
from datetime import datetime
from db.mongodb import posts_collection
import cloudinary.uploader

router = APIRouter(prefix="/posts", tags=["Posts"])


def upload_to_cloudinary(file: UploadFile) -> str:
    try:
        result = cloudinary.uploader.upload(
            file.file,
            folder="posts",
            resource_type="image"
        )
        return result["secure_url"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image upload failed: {str(e)}")


@router.post("/create")
async def create_post(
    type: str = Form(...),                    # Required: LOST or FOUND
    title: str = Form(...),                   # Required
    description: str = Form(""),              # Optional
    place: str = Form(...),                   # Required (was location.place)
    area: str = Form(...),                    # Required (was location.area)
    tags: str = Form(""),                     # Optional, comma-separated
    images: List[UploadFile] = File(default=[]),  # Optional, can be empty
):
    # Upload images if provided
    image_urls = []
    if images:
        for img in images:
            if img.content_type not in ["image/jpeg", "image/png", "image/webp", "image/jpg"]:
                raise HTTPException(status_code=400, detail=f"Invalid file type: {img.filename}")
            if img.size > 10 * 1024 * 1024:  # 10MB limit
                raise HTTPException(status_code=400, detail=f"File too large: {img.filename}")
            url = upload_to_cloudinary(img)
            image_urls.append(url)

    # Process tags
    tags_list = [tag.strip().upper() for tag in tags.split(",") if tag.strip()] if tags else []

    # Create post document
    post_data = {
        "type": type.upper(),  # Ensure consistent: LOST or FOUND
        "title": title.strip(),
        "description": description.strip(),
        "images": image_urls,
        "location": {
            "place": place.strip(),
            "area": area.strip()
        },
        "tags": tags_list,
        "created_at": datetime.utcnow(),
        "upvotes": 0,
        "is_solved": False
    }

    # Insert into MongoDB
    result = posts_collection.insert_one(post_data)
    
    # Prepare response
    post_data["id"] = str(result.inserted_id)
    
    return post_data


@router.get("/get_all")
async def get_all_posts():
    posts = list(posts_collection.find())
    for post in posts:
        post["id"] = str(post["_id"])
        del post["_id"]
    return posts

@router.get("/{post_id}")
async def get_post(post_id: str):   
    post = posts_collection.find_one({"_id": post_id})
    if post:
        post["id"] = str(post["_id"])
        del post["_id"]
        return post         