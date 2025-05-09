from sqlmodel import Session
from .database import engine, Book, UserCredentials
from .auth import get_password_hash

def seed_users(db: Session):
    """Add default users to the database"""
    default_users = [
        UserCredentials(
            username="admin",
            email="admin@bookstore.com",
            password=get_password_hash("admin123")
        ),
        UserCredentials(
            username="user",
            email="user@bookstore.com",
            password=get_password_hash("user123")
        )
    ]
    
    # Check if users already exist
    existing_users = db.query(UserCredentials).count()
    if existing_users == 0:
        for user in default_users:
            db.add(user)
        db.commit()
        print("Default users added successfully")

def seed_books(db: Session):
    """Add default books to the database"""
    default_books = [
        Book(
            name="To Kill a Mockingbird",
            author="Harper Lee",
            published_year=1960,
            book_summary="The story of young Scout Finch, her brother Jem, and their father Atticus, a lawyer who defends a Black man accused of raping a white woman in a racially divided Alabama town."
        ),
        Book(
            name="1984",
            author="George Orwell",
            published_year=1949,
            book_summary="A dystopian novel set in a totalitarian society where critical thought is suppressed and the government engages in constant surveillance of its citizens."
        ),
        Book(
            name="The Great Gatsby",
            author="F. Scott Fitzgerald",
            published_year=1925,
            book_summary="The story follows a cast of characters living in the fictional town of West Egg on Long Island during the summer of 1922."
        ),
        Book(
            name="Pride and Prejudice",
            author="Jane Austen",
            published_year=1813,
            book_summary="A romantic novel following the character development of Elizabeth Bennet, who learns about the repercussions of hasty judgments."
        ),
        Book(
            name="The Hobbit",
            author="J.R.R. Tolkien",
            published_year=1937,
            book_summary="The adventure of Bilbo Baggins, a hobbit who is reluctantly swept into an epic quest to reclaim a stolen treasure from a dragon."
        ),
        Book(
            name="Harry Potter and the Philosopher's Stone",
            author="J.K. Rowling",
            published_year=1997,
            book_summary="The first novel in the Harry Potter series, following the life of a young wizard, Harry Potter, and his friends at Hogwarts School of Witchcraft and Wizardry."
        ),
        Book(
            name="The Alchemist",
            author="Paulo Coelho",
            published_year=1988,
            book_summary="A philosophical novel about a young Andalusian shepherd who dreams of finding a worldly treasure and embarks on a journey to find it."
        ),
        Book(
            name="Brave New World",
            author="Aldous Huxley",
            published_year=1932,
            book_summary="A dystopian novel set in a futuristic World State, whose citizens are environmentally engineered into an intelligence-based social hierarchy."
        )
    ]
    
    # Check if books already exist
    existing_books = db.query(Book).count()
    if existing_books == 0:
        for book in default_books:
            db.add(book)
        db.commit()
        print("Default books added successfully")

def seed_data():
    """Seed the database with initial data"""
    with Session(engine) as db:
        seed_users(db)
        seed_books(db) 