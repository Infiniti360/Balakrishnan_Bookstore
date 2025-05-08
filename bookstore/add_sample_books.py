import os
import requests
import json

# API configuration
API_HOST = os.getenv("API_HOST", "localhost")
API_PORT = os.getenv("API_PORT", "8000")
BASE_URL = f'http://{API_HOST}:{API_PORT}'
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
            "email": os.getenv("ADMIN_EMAIL", "test@example.com"),
            "password": os.getenv("ADMIN_PASSWORD", "password123")
        }
        
        print(f"Connecting to API at {BASE_URL}")
        print("Logging in...")
        response = requests.post(LOGIN_URL, json=login_data)
        response.raise_for_status()
        
        token = response.json()["access_token"]
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        print("Successfully logged in. Adding books...")
        
        # Add each sample book
        for book in SAMPLE_BOOKS:
            try:
                response = requests.post(BOOKS_URL, json=book, headers=headers)
                response.raise_for_status()
                print(f"Added book: {book['name']}")
            except requests.exceptions.RequestException as e:
                print(f"Error adding book {book['name']}: {e}")
                if hasattr(e, 'response') and e.response is not None:
                    print(f"Response: {e.response.text}")
                continue
            
        print("Sample books processing completed!")
        
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"Response: {e.response.text}")

if __name__ == "__main__":
    add_sample_books() 