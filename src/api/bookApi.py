from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/api/books", tags=["books"])

class BookBase(BaseModel):
    title: str
    author: str
    description: Optional[str] = None
    price: float
    stock: int

class BookCreate(BookBase):
    pass

class Book(BookBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

# In-memory storage for books
books_db = []
book_id_counter = 1

# Initialize with some preset books
def init_books():
    global books_db, book_id_counter
    if not books_db:  # Only initialize if empty
        preset_books = [
            {
                "title": "The Great Gatsby",
                "author": "F. Scott Fitzgerald",
                "description": "A novel about the American Dream set during the Roaring Twenties.",
                "price": 12.99,
                "stock": 15
            },
            {
                "title": "To Kill a Mockingbird",
                "author": "Harper Lee",
                "description": "A classic novel about racial inequality in the American South.",
                "price": 14.99,
                "stock": 20
            },
            {
                "title": "1984",
                "author": "George Orwell",
                "description": "A dystopian novel about totalitarianism and surveillance.",
                "price": 11.99,
                "stock": 18
            },
            {
                "title": "Pride and Prejudice",
                "author": "Jane Austen",
                "description": "A romantic novel about societal expectations and love.",
                "price": 9.99,
                "stock": 25
            },
            {
                "title": "The Hobbit",
                "author": "J.R.R. Tolkien",
                "description": "A fantasy adventure novel about Bilbo Baggins' journey.",
                "price": 15.99,
                "stock": 12
            }
        ]
        
        for book_data in preset_books:
            now = datetime.now()
            new_book = Book(
                id=book_id_counter,
                created_at=now,
                updated_at=now,
                **book_data
            )
            books_db.append(new_book)
            book_id_counter += 1

# Initialize preset books
init_books()

@router.get("/", response_model=List[Book])
async def get_books():
    return books_db

@router.post("/", response_model=Book)
async def create_book(book: BookCreate):
    global book_id_counter
    now = datetime.now()
    new_book = Book(
        id=book_id_counter,
        created_at=now,
        updated_at=now,
        **book.dict()
    )
    books_db.append(new_book)
    book_id_counter += 1
    return new_book

@router.get("/{book_id}", response_model=Book)
async def get_book(book_id: int):
    book = next((b for b in books_db if b.id == book_id), None)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book

@router.put("/{book_id}", response_model=Book)
async def update_book(book_id: int, book: BookCreate):
    book_index = next((i for i, b in enumerate(books_db) if b.id == book_id), None)
    if book_index is None:
        raise HTTPException(status_code=404, detail="Book not found")
    
    now = datetime.now()
    updated_book = Book(
        id=book_id,
        created_at=books_db[book_index].created_at,
        updated_at=now,
        **book.dict()
    )
    books_db[book_index] = updated_book
    return updated_book

@router.delete("/{book_id}")
async def delete_book(book_id: int):
    book_index = next((i for i, b in enumerate(books_db) if b.id == book_id), None)
    if book_index is None:
        raise HTTPException(status_code=404, detail="Book not found")
    
    books_db.pop(book_index)
    return {"message": "Book deleted successfully"} 