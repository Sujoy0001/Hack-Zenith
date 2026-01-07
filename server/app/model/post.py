from pydantic import BaseModel, Field
from typing import List, Literal, Optional
from datetime import datetime


class UserModel(BaseModel):
    uid: str
    email: str
    name: str
    avatar: Optional[str] = None


class LocationModel(BaseModel):
    place: str
    area: str


class PostCreateModel(BaseModel):
    types: Literal["lost", "found"]
    title: str
    description: Optional[str] = ""
    images: List[str] = []
    user: UserModel
    location: LocationModel
    tags: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_solved: bool = False


class PostResponseModel(PostCreateModel):
    _id: str
