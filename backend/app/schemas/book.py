from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None

class Category(CategoryBase):
    id: int

    class Config:
        from_attributes = True

class BookBase(BaseModel):
    title: str
    author: str
    description: Optional[str] = None
    price: float
    stock: int
    isbn: Optional[str] = None

class BookCreate(BookBase):
    category_ids: List[int] = []

class BookUpdate(BookBase):
    title: Optional[str] = None
    author: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None
    category_ids: Optional[List[int]] = None

class Book(BookBase):
    id: int
    categories: List[Category] = []
    created_at: datetime

    class Config:
        from_attributes = True 