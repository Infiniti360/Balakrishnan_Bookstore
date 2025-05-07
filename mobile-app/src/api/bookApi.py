from fastapi import APIRouter, HTTPException
from typing import List, Optional
from pydantic import BaseModel

router = APIRouter()

class Book(BaseModel):
    id: Optional[str] = None
    title: str
    author: str
    description: Optional[str] = None

# In-memory storage for books
books = []

@router.get("/", response_model=List[Book])
async def get_books():
    return books

@router.get("/{book_id}", response_model=Book)
async def get_book(book_id: str):
    book = next((b for b in books if b.id == book_id), None)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book

@router.post("/", response_model=Book)
async def create_book(book: Book):
    book.id = str(len(books) + 1)
    books.append(book)
    return book

@router.put("/{book_id}", response_model=Book)
async def update_book(book_id: str, book: Book):
    index = next((i for i, b in enumerate(books) if b.id == book_id), None)
    if index is None:
        raise HTTPException(status_code=404, detail="Book not found")
    book.id = book_id
    books[index] = book
    return book

@router.delete("/{book_id}")
async def delete_book(book_id: str):
    index = next((i for i, b in enumerate(books) if b.id == book_id), None)
    if index is None:
        raise HTTPException(status_code=404, detail="Book not found")
    books.pop(index)
    return {"message": "Book deleted successfully"} 