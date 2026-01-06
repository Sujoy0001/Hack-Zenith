from fastapi import APIRouter, File, Form, HTTPException, UploadFile, Depends, status
from typing import List, Optional, Literal
from datetime import datetime
from bson import ObjectId
from bson.errors import InvalidId
from db.mongodb import posts_collection
import cloudinary
import cloudinary.uploader
import cloudinary.api
from fastapi.security import OAuth2PasswordBearer
import os

router = APIRouter(prefix="/posts", tags=["Posts"])

# Configure Cloudinary (add this at the top)
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

MAX_IMAGES = 10
MAX_IMAGE_SIZE_MB = 10
MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024
ALLOWED_CONTENT_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/jpg",
}

# -------------------------
# Cloudinary upload helper
# -------------------------
def upload_to_cloudinary(file: UploadFile) -> str:
    # Check file size
    if file.size > MAX_IMAGE_SIZE_BYTES:
        raise HTTPException(
            status_code=400,
            detail=f"Image too large: {file.filename} ({file.size} bytes > {MAX_IMAGE_SIZE_MB}MB limit)"
        )

    try:
        # Upload file to Cloudinary
        result = cloudinary.uploader.upload(
            file.file,
            folder="posts",
            resource_type="image",
        )
        return result["secure_url"]
    except Exception as e:
        print(f"Cloudinary upload error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Image upload failed: {str(e)}")

# -------------------------
# Create Post
# -------------------------
@router.post("/create", status_code=status.HTTP_201_CREATED)
async def create_post(
    user_uid: str = Form(...),
    user_email: str = Form(...),
    user_name: str = Form(...),
    user_photo: Optional[str] = Form(None),
    types: Literal["lost", "found"] = Form(...),
    title: str = Form(..., min_length=1, max_length=200),
    description: Optional[str] = Form(""),
    place: str = Form(..., min_length=1, max_length=200),
    area: str = Form(..., min_length=1, max_length=200),
    tags: str = Form(""),
    images: List[UploadFile] = File(default=[]),
):
    # If no images are uploaded, allow the post but with empty image_urls
    image_urls: List[str] = []
    
    # Only process images if there are any
    if images and images[0].filename:  # Check if images were actually uploaded
        # Validate image count
        if len(images) > MAX_IMAGES:
            raise HTTPException(
                status_code=400,
                detail=f"Too many images: maximum {MAX_IMAGES} allowed"
            )

        # Upload images
        for img in images:
            if img.filename == "":
                continue  # Skip empty files

            # Validate content type
            if img.content_type not in ALLOWED_CONTENT_TYPES:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid image type: {img.filename} ({img.content_type})"
                )

            # Reset file pointer
            await img.seek(0)
            
            try:
                # Upload to Cloudinary
                image_urls.append(upload_to_cloudinary(img))
            except HTTPException as e:
                # Re-raise HTTPException from upload_to_cloudinary
                raise e
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Failed to process image: {str(e)}")

    # Process tags
    tags_list = [t.strip().lower() for t in tags.split(",") if t.strip()][:50]

    # Create post document
    post_data = {
        "types": types,
        "title": title.strip(),
        "description": description.strip(),
        "images": image_urls,
        "user": {
            "uid": user_uid.strip(),
            "email": user_email.strip(),
            "name": user_name.strip(),
            "avatar": user_photo.strip() if user_photo else None,
        },
        "location": {
            "place": place.strip(),
            "area": area.strip(),
        },
        "tags": tags_list,
        "created_at": datetime.utcnow(),
        "is_solved": False,
    }

    try:
        # Use insert_one WITH await (Motor async driver)
        result = await posts_collection.insert_one(post_data)

        # Prepare response
        response_data = post_data.copy()
        response_data["id"] = str(result.inserted_id)
        
        return response_data
    except Exception as e:
        print(f"Database error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# -------------------------
# Get all posts
# -------------------------
@router.get("/get_all")
async def get_all_posts():
    posts = []
    
    try:
        cursor = posts_collection.find().sort("created_at", -1)
        
        async for post in cursor:
            post["id"] = str(post["_id"])
            del post["_id"]
            posts.append(post)

        return posts
    except Exception as e:
        print(f"Error fetching posts: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching posts")

# -------------------------
# Get single post
# -------------------------
@router.get("/{post_id}")
async def get_post(post_id: str):
    try:
        post = await posts_collection.find_one({"_id": ObjectId(post_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid post ID")

    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    post["id"] = str(post["_id"])
    del post["_id"]
    return post

@router.delete("/delete_all")
async def delete_all_posts():
    try:
        result = await posts_collection.delete_many({})
        return {"message": f"All posts deleted. Count: {result.deleted_count}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting posts: {str(e)}")