import requests
import json

# API configuration
BASE_URL = 'http://localhost:8000'
LOGIN_URL = f'{BASE_URL}/login'
BOOKS_URL = f'{BASE_URL}/books/'

# Sample books data
SAMPLE_BOOKS = [
    {
        "name": "The Great Gatsby",
        "author": "F. Scott Fitzgerald",
        "published_year": 1925,
        "book_summary": "A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan."
    },
    {
        "name": "To Kill a Mockingbird",
        "author": "Harper Lee",
        "published_year": 1960,
        "book_summary": "The story of racial injustice and the loss of innocence in the American South."
    },
    {
        "name": "1984",
        "author": "George Orwell",
        "published_year": 1949,
        "book_summary": "A dystopian social science fiction novel and cautionary tale."
    },
    {
        "name": "Pride and Prejudice",
        "author": "Jane Austen",
        "published_year": 1813,
        "book_summary": "A romantic novel of manners that follows the emotional development of Elizabeth Bennet."
    },
    {
        "name": "The Hobbit",
        "author": "J.R.R. Tolkien",
        "published_year": 1937,
        "book_summary": "The adventure of Bilbo Baggins, a hobbit who embarks on a quest to help a group of dwarves."
    }
]

def add_sample_books():
    try:
        # Login to get token
        login_data = {
            "email": "test@example.com",
            "password": "password123"
        }
        
        response = requests.post(LOGIN_URL, json=login_data)
        response.raise_for_status()
        
        token = response.json()["access_token"]
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        # Add each sample book
        for book in SAMPLE_BOOKS:
            response = requests.post(BOOKS_URL, json=book, headers=headers)
            response.raise_for_status()
            print(f"Added book: {book['name']}")
            
        print("All sample books added successfully!")
        
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        if hasattr(e, 'response'):
            print(f"Response: {e.response.text}")

if __name__ == "__main__":
    add_sample_books() 