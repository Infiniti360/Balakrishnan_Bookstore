from pydantic import BaseModel, EmailStr
from typing import List, Optional

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    username: str

class BookCreate(BaseModel):
    name: str
    author: str
    published_year: int
    book_summary: str

class BookUpdate(BaseModel):
    name: Optional[str] = None
    author: Optional[str] = None
    published_year: Optional[int] = None
    book_summary: Optional[str] = None

class BookResponse(BaseModel):
    id: int
    name: str
    author: str
    published_year: int
    book_summary: str

class BookList(BaseModel):
    books: List[BookResponse]

class Message(BaseModel):
    message: str 