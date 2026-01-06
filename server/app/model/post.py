from pydantic import BaseModel
from typing import List
from datetime import datetime
from .user import User as UserModel
from .user import LocationModel

class PostModel(BaseModel):
    id: str
    type: str
    title: str
    description: str
    images: List[str]
    location: LocationModel
    tags: List[str]
    created_at: datetime
    is_solved: bool = False