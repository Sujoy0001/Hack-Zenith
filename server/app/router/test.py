# app/routes/test.py

from fastapi import APIRouter, Depends
from auth import get_current_user
from firebase import db

router = APIRouter()

@router.get("/secure")
def secure_endpoint(user=Depends(get_current_user)):
    return {
        "uid": user["uid"],
        "email": user.get("email")
    }
