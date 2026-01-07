from pydantic import BaseModel, EmailStr

class User(BaseModel):
    uid: str
    name: str
    email: EmailStr