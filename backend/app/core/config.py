from typing import List
from pydantic import BaseSettings, AnyHttpUrl

class Settings(BaseSettings):
    PROJECT_NAME: str = "Bookstore"
    PROJECT_VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # CORS Configuration
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",  # React frontend local
        "http://localhost:8000",  # Backend API local
        "http://frontend:3000",   # React frontend in Docker
        "http://backend:8000",    # Backend API in Docker
        "*"                       # Allow all origins temporarily for debugging
    ]
    
    # Database Configuration
    SQLALCHEMY_DATABASE_URI: str = "sqlite:///./bookstore.db"
    
    # JWT Configuration
    SECRET_KEY: str = "your-secret-key-here"  # In production, use a secure secret key
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    
    # Superuser Configuration
    FIRST_SUPERUSER: str = "admin@bookstore.com"
    FIRST_SUPERUSER_PASSWORD: str = "admin123"

    class Config:
        case_sensitive = True

settings = Settings() 