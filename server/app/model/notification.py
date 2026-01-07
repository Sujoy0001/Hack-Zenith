from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class Notification(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    user_id: str
    title: str
    message: str
    type: str = "notification"
    read: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
