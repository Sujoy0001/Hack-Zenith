from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import datetime
from .user import User as UserModel
from .user import LocationModel


class PostModel(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    types: Literal["lost", "found"]
    title: str
    user: UserModel
    description: str
    images: List[str] = []
    location: LocationModel
    tags: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_solved: bool = False