import os
from typing import Optional
from sqlmodel import Field, SQLModel, Session, create_engine
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Use environment variable for database URL or default to SQLite
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./bookstore.db")

# Create SQLModel classes for our data models
class UserCredentials(SQLModel, table=True):
    __tablename__ = "user_credentials"
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True)
    username: str = Field(index=True)
    password: str  # Hashed password will be stored

class Book(SQLModel, table=True):
    __tablename__ = "books"
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    author: str = Field(index=True)
    published_year: int
    book_summary: str

# Create database engine
if DATABASE_URL.startswith("sqlite"):
    # For SQLite, we need to set check_same_thread to False
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    # For other databases (PostgreSQL, MySQL, etc.)
    engine = create_engine(DATABASE_URL)

def init_db():
    """Initialize the database by creating all tables"""
    SQLModel.metadata.create_all(engine)

def get_db():
    """Get database session"""
    with Session(engine) as session:
        yield session 