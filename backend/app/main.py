from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List, Optional
import jwt
from pydantic import BaseModel
import os
import logging
import sys
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response

from .database import SessionLocal, engine
from . import models, schemas
from .api.v1.api import api_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

# Drop all tables and create new ones
logger.info("Initializing database...")
try:
    models.Base.metadata.create_all(bind=engine)
    logger.info("Database initialized successfully")
except Exception as e:
    logger.error(f"Error initializing database: {str(e)}")
    raise

app = FastAPI(
    title="Bookstore API with FastAPI",
    version="1.0.0",
    description="Bookstore API with FastAPI",
    openapi_url="/openapi.json"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # More permissive for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Error logging middleware
class ErrorLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        try:
            response = await call_next(request)
            return response
        except Exception as e:
            logger.error(f"Request failed: {request.method} {request.url}")
            logger.error(f"Error: {str(e)}")
            return JSONResponse(
                status_code=500,
                content={"detail": str(e)}
            )

app.add_middleware(ErrorLoggingMiddleware)

# Include API router
app.include_router(api_router, prefix="/api/v1")

# JWT Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except jwt.JWTError as e:
        logger.error(f"JWT validation error: {str(e)}")
        raise credentials_exception
    user = db.query(models.User).filter(models.User.username == username).first()
    if user is None:
        logger.error(f"User not found: {username}")
        raise credentials_exception
    return user

@app.get("/books", response_model=List[schemas.Book])
def get_books(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    try:
        books = db.query(models.Book).offset(skip).limit(limit).all()
        return books
    except Exception as e:
        logger.error(f"Error fetching books: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching books")

@app.get("/books/{book_id}", response_model=schemas.Book)
def get_book(book_id: int, db: Session = Depends(get_db)):
    try:
        book = db.query(models.Book).filter(models.Book.id == book_id).first()
        if book is None:
            raise HTTPException(status_code=404, detail="Book not found")
        return book
    except Exception as e:
        logger.error(f"Error fetching book {book_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching book")

@app.post("/books", response_model=schemas.Book)
def create_book(book: schemas.BookCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    try:
        db_book = models.Book(**book.dict())
        db.add(db_book)
        db.commit()
        db.refresh(db_book)
        return db_book
    except Exception as e:
        logger.error(f"Error creating book: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Error creating book")

@app.get("/health")
def health_check():
    try:
        # Test database connection
        db = SessionLocal()
        db.execute("SELECT 1")
        db.close()
        return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Health check failed")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Bookstore API"} 