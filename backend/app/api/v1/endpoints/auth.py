from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.security import create_access_token, get_password_hash, verify_password
from app.api import deps
from app.crud import crud_user
from app.schemas.token import Token
from app.schemas.user import UserCreate, User
from app.models import User as UserModel

router = APIRouter()

@router.post("/login", response_model=Token)
def login(
    db: Session = Depends(deps.get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = crud_user.authenticate(
        db, email=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    elif not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Inactive user",
        )
    
    access_token_expires = timedelta(minutes=60 * 24 * 8)  # 8 days
    access_token = create_access_token(
        user.id, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.post("/register", response_model=Token)
def register(
    *,
    db: Session = Depends(deps.get_db),
    user_in: UserCreate,
) -> Any:
    """
    Create new user
    """
    # Check email
    db_user = db.query(UserModel).filter(UserModel.email == user_in.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    
    # Check username
    db_user = db.query(UserModel).filter(UserModel.username == user_in.username).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken",
        )
    
    # Create new user
    hashed_password = get_password_hash(user_in.password)
    db_user = UserModel(
        email=user_in.email,
        username=user_in.username,
        hashed_password=hashed_password,
        is_active=True,
        is_superuser=False
    )
    db.add(db_user)
    try:
        db.commit()
        db.refresh(db_user)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating user: {str(e)}"
        )
    
    # Generate access token
    access_token_expires = timedelta(minutes=60 * 24 * 8)  # 8 days
    access_token = create_access_token(
        db_user.id, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": db_user
    } 