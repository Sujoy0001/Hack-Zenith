from pydantic import BaseModel, EmailStr

class User(BaseModel):
    id: int
    name: str
    email: EmailStr
    is_active: bool = True     
    is_verified: bool = False
    created_at: str
    updated_at: str