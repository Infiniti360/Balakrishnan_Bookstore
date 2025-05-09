from fastapi import APIRouter, Depends, HTTPException, status, Form, Request
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlmodel import Session, select
from datetime import timedelta
from typing import List
import traceback

from .database import get_db, Book, UserCredentials
from .auth import authenticate_user, create_access_token, get_password_hash, get_current_user
from .models import (
    BookResponse, BookCreate, BookUpdate, UserCreate, UserResponse, 
    Token, Message
)

router = APIRouter()

# Authentication routes
@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.exec(select(UserCredentials).where(UserCredentials.email == user.email)).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user with hashed password
    db_user = UserCredentials(
        email=user.email,
        username=user.username,
        password=get_password_hash(user.password)
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    print(f"Login attempt with username: {form_data.username}")  # Debug log
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/logout", response_model=Message)
def logout():
    # In this implementation, we're using JWT tokens which are stateless
    # The client should discard the token when logging out
    return {"message": "Successfully logged out"}

# Book API routes
@router.get("/books", response_model=List[BookResponse])
def get_books(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: UserCredentials = Depends(get_current_user)
):
    books = db.exec(select(Book).offset(skip).limit(limit)).all()
    return books

@router.post("/books", response_model=BookResponse, status_code=status.HTTP_201_CREATED)
async def create_book(
    request: Request,
    book: BookCreate,
    db: Session = Depends(get_db),
    current_user: UserCredentials = Depends(get_current_user)
):
    try:
        # Log the incoming request data
        body = await request.json()
        print(f"Creating book with data: {body}")
        
        # Validate the year
        if book.published_year < 1000 or book.published_year > 9999:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Published year must be between 1000 and 9999"
            )
            
        # Create the book using dict() instead of model_dump()
        book_data = book.dict()
        print(f"Converted book data: {book_data}")
        db_book = Book(**book_data)
        db.add(db_book)
        db.commit()
        db.refresh(db_book)
        
        print(f"Book created successfully: {db_book}")
        return db_book
        
    except ValueError as ve:
        print(f"Validation error: {str(ve)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve)
        )
    except Exception as e:
        print(f"Error creating book: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

@router.get("/books/{book_id}", response_model=BookResponse)
def get_book(
    book_id: int,
    db: Session = Depends(get_db),
    current_user: UserCredentials = Depends(get_current_user)
):
    book = db.get(Book, book_id)
    if not book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Book not found"
        )
    return book

@router.put("/books/{book_id}", response_model=BookResponse)
def update_book(
    book_id: int,
    book_update: BookUpdate,
    db: Session = Depends(get_db),
    current_user: UserCredentials = Depends(get_current_user)
):
    db_book = db.get(Book, book_id)
    if not db_book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Book not found"
        )
    
    # Update fields that are provided
    update_data = book_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_book, key, value)
    
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book

@router.delete("/books/{book_id}", response_model=Message)
def delete_book(
    book_id: int,
    db: Session = Depends(get_db),
    current_user: UserCredentials = Depends(get_current_user)
):
    db_book = db.get(Book, book_id)
    if not db_book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Book not found"
        )
    
    db.delete(db_book)
    db.commit()
    return {"message": "Book deleted successfully"} 