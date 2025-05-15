from sqlalchemy.orm import Session
from ..core.config import settings
from ..crud import user
from ..schemas.user import UserCreate
from ..db import base  # noqa: F401
from . import base_class
from app.db.models import Category, Book

# Make sure all SQLAlchemy models are imported before initializing DB
# otherwise, SQLAlchemy might fail to initialize relationships properly

def init_db(db: Session) -> None:
    # Create tables
    base_class.Base.metadata.create_all(bind=db.get_bind())

    # Create first superuser if it doesn't exist
    user_obj = user.get_by_email(db, email=settings.FIRST_SUPERUSER)
    if not user_obj:
        user_in = UserCreate(
            email=settings.FIRST_SUPERUSER,
            password=settings.FIRST_SUPERUSER_PASSWORD,
            username="admin",
            is_superuser=True,
        )
        user_obj = user.create(db, obj_in=user_in)

    # Create initial categories
    categories = [
        {"name": "Fiction", "description": "Fictional literature"},
        {"name": "Non-Fiction", "description": "Non-fictional literature"},
        {"name": "Science", "description": "Scientific books"},
        {"name": "Technology", "description": "Technology related books"},
    ]
    
    print("Creating initial categories...")
    created_categories = {}
    for category_data in categories:
        db_category = db.query(Category).filter(
            Category.name == category_data["name"]
        ).first()
        if not db_category:
            db_category = Category(**category_data)
            db.add(db_category)
            print(f"Created category: {category_data['name']}")
        created_categories[category_data["name"]] = db_category
    
    db.commit()

    # Create sample books
    sample_books = [
        {
            "title": "The Great Gatsby",
            "author": "F. Scott Fitzgerald",
            "description": "A story of decadence and excess.",
            "price": 9.99,
            "stock": 50,
            "isbn": "978-0743273565",
            "categories": [created_categories["Fiction"]]
        },
        {
            "title": "Clean Code",
            "author": "Robert C. Martin",
            "description": "A handbook of agile software craftsmanship.",
            "price": 29.99,
            "stock": 30,
            "isbn": "978-0132350884",
            "categories": [created_categories["Technology"]]
        },
        {
            "title": "A Brief History of Time",
            "author": "Stephen Hawking",
            "description": "A landmark volume in science writing.",
            "price": 14.99,
            "stock": 25,
            "isbn": "978-0553380163",
            "categories": [created_categories["Science"]]
        },
        {
            "title": "The Pragmatic Programmer",
            "author": "Andrew Hunt, David Thomas",
            "description": "Your journey to mastery.",
            "price": 39.99,
            "stock": 20,
            "isbn": "978-0201616224",
            "categories": [created_categories["Technology"]]
        }
    ]

    print("Creating sample books...")
    for book_data in sample_books:
        existing_book = db.query(Book).filter(Book.isbn == book_data["isbn"]).first()
        if not existing_book:
            categories = book_data.pop("categories")
            db_book = Book(**book_data)
            db_book.categories = categories
            db.add(db_book)
            print(f"Created book: {book_data['title']}")
    
    db.commit()
    print("Database initialization completed successfully!") 