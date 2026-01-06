from pydantic import BaseModel, EmailStr, HttpUrl

class User(BaseModel):
    id: str
    name: str
    email: EmailStr
    avatar: str | None = None
    phone: str | None = None
    address: str | None = None

class LocationModel(BaseModel):
    place: str
    area: str