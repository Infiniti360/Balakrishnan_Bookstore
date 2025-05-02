from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import Book as DBBook  # Rename to avoid confusion
from database import get_db
from middleware import JWTBearer
from models import Book, BookCreate, BookUpdate, ErrorResponse

router = APIRouter()


@router.post("/books/", response_model=Book, dependencies=[Depends(JWTBearer())], responses={400: {"model": ErrorResponse}})
async def create_book(book: BookCreate, db: Session = Depends(get_db)):
    db_book = DBBook(**book.dict())
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book


@router.put("/books/{book_id}", response_model=Book, dependencies=[Depends(JWTBearer())], responses={404: {"model": ErrorResponse}})
async def update_book(book_id: int, update_data: BookUpdate, db: Session = Depends(get_db)):
    db_book = db.query(DBBook).filter(DBBook.id == book_id).first()
    if db_book is None:
        raise HTTPException(status_code=404, detail="Book not found")

    update_data_dict = update_data.dict(exclude_unset=True)
    for key, value in update_data_dict.items():
        setattr(db_book, key, value)

    db.commit()
    db.refresh(db_book)
    return db_book


@router.delete("/books/{book_id}", dependencies=[Depends(JWTBearer())], responses={404: {"model": ErrorResponse}})
async def delete_book(book_id: int, db: Session = Depends(get_db)):
    db_book = db.query(DBBook).filter(DBBook.id == book_id).first()
    if db_book is None:
        raise HTTPException(status_code=404, detail="Book not found")
    db.delete(db_book)
    db.commit()
    return {"message": "Book deleted successfully"}


@router.get("/books/{book_id}", response_model=Book, dependencies=[Depends(JWTBearer())], responses={404: {"model": ErrorResponse}})
async def get_book_by_id(book_id: int, db: Session = Depends(get_db)):
    db_book = db.query(DBBook).filter(DBBook.id == book_id).first()
    if db_book is None:
        raise HTTPException(status_code=404, detail="Book not found")
    return db_book


@router.get("/books/", response_model=List[Book], dependencies=[Depends(JWTBearer())])
async def get_all_books(db: Session = Depends(get_db)):
    books = db.query(DBBook).all()
    return books
