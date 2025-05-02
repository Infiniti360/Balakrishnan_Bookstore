from typing import Optional
from pydantic import BaseModel

class BookBase(BaseModel):
    name: str
    author: str
    published_year: int
    book_summary: str

class BookCreate(BookBase):
    pass

class BookUpdate(BookBase):
    pass

class Book(BookBase):
    id: int

    class Config:
        orm_mode = True

class ErrorResponse(BaseModel):
    detail: str 