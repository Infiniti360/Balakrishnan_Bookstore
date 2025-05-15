from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        orm_mode = True

class BookBase(BaseModel):
    title: str
    description: Optional[str] = None
    author: str
    price: float
    cover_image: Optional[str] = None
    stock: Optional[int] = 0

class BookCreate(BookBase):
    pass

class Book(BookBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None 