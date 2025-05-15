from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ...crud import book as crud_book
from ...schemas.book import Book, BookCreate, BookUpdate
from ...api import deps
from ...models.user import User

router = APIRouter()

@router.get("/books", response_model=List[Book])
def read_books(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
) -> List[Book]:
    """
    Retrieve books.
    """
    books = crud_book.get_multi(db, skip=skip, limit=limit)
    return books

@router.post("/books", response_model=Book)
def create_book(
    *,
    db: Session = Depends(deps.get_db),
    book_in: BookCreate,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Book:
    """
    Create new book.
    """
    book = crud_book.create(db, obj_in=book_in)
    return book 