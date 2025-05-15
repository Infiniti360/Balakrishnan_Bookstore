from typing import List, Optional, Union, Dict, Any
from sqlalchemy.orm import Session
from app.db.models import Book, Category
from app.schemas.book import BookCreate, BookUpdate

def get(db: Session, id: int) -> Book:
    return db.query(Book).filter(Book.id == id).first()

def get_multi(db: Session, *, skip: int = 0, limit: int = 100) -> List[Book]:
    return db.query(Book).offset(skip).limit(limit).all()

def create(db: Session, *, obj_in: BookCreate) -> Book:
    db_obj = Book(
        title=obj_in.title,
        author=obj_in.author,
        description=obj_in.description,
        price=obj_in.price,
        stock=obj_in.stock,
        isbn=obj_in.isbn,
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def get_books(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    search: Optional[str] = None
) -> List[Book]:
    query = db.query(Book)
    
    if category:
        query = query.join(Book.categories).filter(Category.name == category)
    
    if search:
        search = f"%{search}%"
        query = query.filter(
            (Book.title.ilike(search)) |
            (Book.author.ilike(search)) |
            (Book.description.ilike(search))
        )
    
    return query.offset(skip).limit(limit).all()

def update_book(
    db: Session,
    db_obj: Book,
    obj_in: Union[BookUpdate, Dict[str, Any]]
) -> Book:
    if isinstance(obj_in, dict):
        update_data = obj_in
    else:
        update_data = obj_in.dict(exclude_unset=True)
    
    # Handle category updates separately
    category_ids = update_data.pop("category_ids", None)
    if category_ids is not None:
        categories = db.query(Category).filter(
            Category.id.in_(category_ids)
        ).all()
        db_obj.categories = categories
    
    # Update other fields
    for field in update_data:
        if hasattr(db_obj, field):
            setattr(db_obj, field, update_data[field])
    
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def delete_book(db: Session, book_id: int) -> Book:
    book = db.query(Book).filter(Book.id == book_id).first()
    db.delete(book)
    db.commit()
    return book 