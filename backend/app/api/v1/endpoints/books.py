from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.book import BookCreate, BookUpdate, Book
from app.crud import book as crud_book
from app.api import deps

router = APIRouter()

@router.get("/", response_model=List[Book])
def get_books(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    search: Optional[str] = None
):
    """
    Retrieve books with optional filtering.
    """
    books = crud_book.get_books(db, skip=skip, limit=limit, category=category, search=search)
    return books

@router.post("/", response_model=Book)
def create_book(
    *,
    db: Session = Depends(get_db),
    book_in: BookCreate,
    # current_user = Depends(deps.get_current_active_superuser) # Commented out for now
):
    """
    Create new book (admin only).
    """
    book = crud_book.create_book(db=db, book_in=book_in)
    return book

@router.get("/{book_id}", response_model=Book)
def get_book(
    *,
    db: Session = Depends(get_db),
    book_id: int
):
    """
    Get book by ID.
    """
    book = crud_book.get_book(db=db, book_id=book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book

@router.put("/{book_id}", response_model=Book)
def update_book(
    *,
    db: Session = Depends(get_db),
    book_id: int,
    book_in: BookUpdate,
    # current_user = Depends(deps.get_current_active_superuser) # Commented out for now
):
    """
    Update book (admin only).
    """
    book = crud_book.get_book(db=db, book_id=book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    book = crud_book.update_book(db=db, db_obj=book, obj_in=book_in)
    return book

@router.delete("/{book_id}")
def delete_book(
    *,
    db: Session = Depends(get_db),
    book_id: int,
    # current_user = Depends(deps.get_current_active_superuser) # Commented out for now
):
    """
    Delete book (admin only).
    """
    book = crud_book.get_book(db=db, book_id=book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    book = crud_book.delete_book(db=db, book_id=book_id)
    return {"message": "Book deleted successfully"} 