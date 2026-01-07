from pydantic import BaseModel, EmailStr
from typing import Optional

class User(BaseModel):
    uid: str
    email: str
    name: str
    photoURL: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

class LocationModel(BaseModel):
    place: str
    area: str