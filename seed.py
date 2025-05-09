from sqlalchemy.orm import Session
from database import engine, Book, Base

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

# Seed data
seed_books = [
    {
        "name": "The Great Gatsby",
        "author": "F. Scott Fitzgerald",
        "published_year": 1925,
        "book_summary": "A story of decadence and excess, following the mysterious millionaire Jay Gatsby."
    },
    {
        "name": "To Kill a Mockingbird",
        "author": "Harper Lee",
        "published_year": 1960,
        "book_summary": "A story of racial injustice and loss of innocence in the American South."
    },
    {
        "name": "1984",
        "author": "George Orwell",
        "published_year": 1949,
        "book_summary": "A dystopian novel about surveillance and control in a totalitarian society."
    },
    {
        "name": "Pride and Prejudice",
        "author": "Jane Austen",
        "published_year": 1813,
        "book_summary": "A romantic novel about the Bennet sisters and their journey to find love."
    },
    {
        "name": "The Hobbit",
        "author": "J.R.R. Tolkien",
        "published_year": 1937,
        "book_summary": "A fantasy novel about Bilbo Baggins' adventure to reclaim the Lonely Mountain."
    }
]

def seed_database():
    """Seed the database with initial data"""
    try:
        with Session(engine) as session:
            # Check if we already have books
            existing_count = session.query(Book).count()
            if existing_count == 0:
                print("No existing books found. Adding seed data...")
                for book in seed_books:
                    session.add(Book(**book))
                session.commit()
                print(f"Successfully added {len(seed_books)} books to the database.")
            else:
                print(f"Database already contains {existing_count} books. Skipping seed.")
    except Exception as e:
        print(f"Error seeding database: {str(e)}")
        raise e

if __name__ == "__main__":
    seed_database()