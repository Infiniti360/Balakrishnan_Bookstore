from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict
from app.database import get_db
from app import models, schemas
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from app.core import security

api_router = APIRouter()

@api_router.get("/books", response_model=List[schemas.Book])
def get_books(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    try:
        books = db.query(models.Book).offset(skip).limit(limit).all()
        return [schemas.Book(
            id=book.id,
            title=book.title,
            author=book.author,
            description=book.description,
            price=book.price,
            cover_image=book.cover_image,
            stock=getattr(book, 'stock', 0),
            created_at=book.created_at
        ) for book in books]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/books", response_model=schemas.Book)
def create_book(book: schemas.BookCreate, db: Session = Depends(get_db)):
    try:
        db_book = models.Book(**book.dict())
        db.add(db_book)
        db.commit()
        db.refresh(db_book)
        return db_book
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/books/{book_id}", response_model=schemas.Book)
def get_book(book_id: int, db: Session = Depends(get_db)):
    book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if book is None:
        raise HTTPException(status_code=404, detail="Book not found")
    return book

@api_router.post("/auth/register", response_model=Dict)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_password = security.get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        username=user.username,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"message": "User registered successfully", "username": db_user.username}

@api_router.post("/auth/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# api_router.include_router(books.router, prefix="/books", tags=["books"])
# api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
# api_router.include_router(users.router, prefix="/users", tags=["users"])
# api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
# api_router.include_router(categories.router, prefix="/categories", tags=["categories"])
# api_router.include_router(orders.router, prefix="/orders", tags=["orders"]) 