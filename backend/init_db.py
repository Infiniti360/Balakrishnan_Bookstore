from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db.models import Base, Book, User
from app.core.config import settings
from app.db.session import SessionLocal

def init_db(db: SessionLocal) -> None:
    # Add some sample books if the database is empty
    if not db.query(Book).first():
        sample_books = [
            Book(
                title="The Great Gatsby",
                author="F. Scott Fitzgerald",
                price=9.99,
                description="A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.",
                stock=10
            ),
            Book(
                title="To Kill a Mockingbird",
                author="Harper Lee",
                price=12.99,
                description="The story of young Scout Finch and her father Atticus in a racially divided Alabama town.",
                stock=15
            ),
            Book(
                title="1984",
                author="George Orwell",
                price=10.99,
                description="A dystopian social science fiction novel and cautionary tale.",
                stock=20
            )
        ]
        for book in sample_books:
            db.add(book)
        db.commit()

def main() -> None:
    print("Creating initial data")
    
    # Create engine
    engine = create_engine(settings.SQLALCHEMY_DATABASE_URI)
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    # Create session
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    try:
        init_db(db)
    finally:
        db.close()
    
    print("Initial data created")

if __name__ == "__main__":
    main() 