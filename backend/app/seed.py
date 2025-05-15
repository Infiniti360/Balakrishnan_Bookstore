from sqlalchemy.orm import Session
from . import models
from .database import SessionLocal

def seed_books(db: Session):
    sample_books = [
        {
            "title": "The Design of Everyday Things",
            "author": "Don Norman",
            "description": "A powerful primer on how—and why—some products satisfy customers while others only frustrate them.",
            "price": 29.99,
            "cover_image": "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
        },
        {
            "title": "Atomic Habits",
            "author": "James Clear",
            "description": "An easy and proven way to build good habits and break bad ones.",
            "price": 24.99,
            "cover_image": "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
        },
        {
            "title": "Deep Work",
            "author": "Cal Newport",
            "description": "Rules for focused success in a distracted world.",
            "price": 19.99,
            "cover_image": "https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
        },
        {
            "title": "The Psychology of Money",
            "author": "Morgan Housel",
            "description": "Timeless lessons on wealth, greed, and happiness.",
            "price": 34.99,
            "cover_image": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
        },
        {
            "title": "Zero to One",
            "author": "Peter Thiel",
            "description": "Notes on startups, or how to build the future.",
            "price": 27.99,
            "cover_image": "https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
        },
        {
            "title": "Think and Grow Rich",
            "author": "Napoleon Hill",
            "description": "The classic guide to personal achievement.",
            "price": 22.99,
            "cover_image": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
        }
    ]

    for book_data in sample_books:
        book = models.Book(**book_data)
        db.add(book)
    
    try:
        db.commit()
        print("Successfully seeded books data!")
    except Exception as e:
        print(f"Error seeding books: {str(e)}")
        db.rollback()

def main():
    db = SessionLocal()
    try:
        seed_books(db)
    finally:
        db.close()

if __name__ == "__main__":
    main() 